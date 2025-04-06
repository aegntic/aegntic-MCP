import asyncio
import os
import sys
import traceback
from typing import List, Optional

import logging
logging.getLogger().addHandler(logging.NullHandler())
logging.getLogger().propagate = False

from aegntic_browser_use.agent.custom_prompts import (
    CustomAgentMessagePrompt,
    CustomSystemPrompt,
)

from browser_use import BrowserConfig
from browser_use.browser.context import BrowserContextConfig, BrowserContextWindowSize
from fastmcp.server import FastMCP
from mcp.types import TextContent

from aegntic_browser_use.agent.custom_agent import CustomAgent
from aegntic_browser_use.browser.custom_browser import CustomBrowser
from aegntic_browser_use.controller.custom_controller import CustomController
from aegntic_browser_use.utils import utils
from aegntic_browser_use.utils.agent_state import AgentState

# Global references for single "running agent" approach
_global_agent = None
_global_browser = None
_global_browser_context = None
_global_agent_state = AgentState()

app = FastMCP("aegntic_browser_use")


def get_env_bool(key: str, default: bool = False) -> bool:
    """Get boolean value from environment variable."""
    return os.getenv(key, str(default)).lower() in ("true", "1", "yes")


async def _safe_cleanup():
    """Safely clean up browser resources"""
    global _global_browser, _global_agent_state, _global_browser_context, _global_agent

    try:
        if _global_agent_state:
            try:
                await _global_agent_state.request_stop()
            except Exception:
                pass

        if _global_browser_context:
            try:
                await _global_browser_context.close()
            except Exception:
                pass

        if _global_browser:
            try:
                await _global_browser.close()
            except Exception:
                pass

    except Exception as e:
        # Log the error, but don't re-raise
        print(f"Error during cleanup: {e}", file=sys.stderr)
    finally:
        # Reset global variables
        _global_browser = None
        _global_browser_context = None
        _global_agent_state = AgentState()
        _global_agent = None


@app.tool()
async def run_browser_agent(task: str, add_infos: str = "") -> str:
    """Handle run-browser-agent tool calls."""
    global _global_agent, _global_browser, _global_browser_context, _global_agent_state

    try:
        # Clear any previous agent stop signals
        _global_agent_state.clear_stop()

        # Get browser configuration
        headless = get_env_bool("BROWSER_HEADLESS", True)
        disable_security = get_env_bool("BROWSER_DISABLE_SECURITY", False)
        chrome_instance_path = os.getenv("BROWSER_CHROME_INSTANCE_PATH", None)
        window_w = int(os.getenv("BROWSER_WINDOW_WIDTH", "1280"))
        window_h = int(os.getenv("BROWSER_WINDOW_HEIGHT", "720"))

        # Get agent configuration
        model_provider = os.getenv("MCP_MODEL_PROVIDER", "openrouter")
        model_name = os.getenv("MCP_MODEL_NAME", "quasar-alpha")
        temperature = float(os.getenv("MCP_TEMPERATURE", "0.7"))
        max_steps = int(os.getenv("MCP_MAX_STEPS", "100"))
        use_vision = get_env_bool("MCP_USE_VISION", True)
        max_actions_per_step = int(os.getenv("MCP_MAX_ACTIONS_PER_STEP", "5"))
        tool_calling_method = os.getenv("MCP_TOOL_CALLING_METHOD", "auto")

        # Configure browser window size
        extra_chromium_args = [f"--window-size={window_w},{window_h}"]

        # Initialize browser if needed
        if not _global_browser:
            _global_browser = CustomBrowser(
                config=BrowserConfig(
                    headless=headless,
                    disable_security=disable_security,
                    chrome_instance_path=chrome_instance_path,
                    extra_chromium_args=extra_chromium_args,
                )
            )

        # Initialize browser context if needed
        if not _global_browser_context:
            _global_browser_context = await _global_browser.new_context(
                config=BrowserContextConfig(
                    trace_path=os.getenv("BROWSER_TRACE_PATH"),
                    save_recording_path=os.getenv("BROWSER_RECORDING_PATH"),
                    no_viewport=False,
                    browser_window_size=BrowserContextWindowSize(
                        width=window_w, height=window_h
                    ),
                )
            )

        # Prepare LLM
        llm = utils.get_llm_model(
            provider=model_provider, model_name=model_name, temperature=temperature
        )

        # Create controller and agent
        controller = CustomController()
        _global_agent = CustomAgent(
            task=task,
            add_infos=add_infos,
            use_vision=use_vision,
            llm=llm,
            browser=_global_browser,
            browser_context=_global_browser_context,
            controller=controller,
            system_prompt_class=CustomSystemPrompt,
            agent_prompt_class=CustomAgentMessagePrompt,
            max_actions_per_step=max_actions_per_step,
            agent_state=_global_agent_state,
            tool_calling_method=tool_calling_method,
        )

        # Run agent with improved error handling
        try:
            history = await _global_agent.run(max_steps=max_steps)
            final_result = (
                history.final_result()
                or f"No final result. Possibly incomplete. {history}"
            )
            return final_result
        except asyncio.CancelledError:
            return "Task was cancelled"
        except Exception as e:
            error_message = str(e).lower()
            if "quasar-alpha" in error_message and ("not found" in error_message or "unavailable" in error_message):
                return (
                    "The default model 'quasar-alpha' is currently unavailable on OpenRouter. "
                    "Please set the environment variable MCP_MODEL_NAME to an alternative OpenRouter model "
                    "(e.g., 'mistral', 'gpt-4', etc.) and try again."
                )
            logging.error(f"Agent run error: {str(e)}\n{traceback.format_exc()}")
            return f"Error during task execution: {str(e)}"

    except Exception as e:
        logging.error(f"run-browser-agent error: {str(e)}\n{traceback.format_exc()}")
        return f"Error during task execution: {str(e)}"

    finally:
        asyncio.create_task(_safe_cleanup())


def main():
    app.run()


if __name__ == "__main__":
    main()
