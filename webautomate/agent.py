# agent.py - The Command-Line Entry Point

import asyncio
import logging
from modules.runner import run_high_level_task
from modules.controller_setup import browser_session

# Configure logging for the entire application
logging.basicConfig(level=logging.INFO, format='[%(name)-15s] [%(levelname)s] %(message)s')

def main():
    """
    Gets user input from the command line and starts the automation task.
    This is the main "executable" part of the application.
    """
    try:
        user_input = input("What do you want to do? (type 'exit' to quit)\n> ")
        if user_input.lower() not in ["exit", "quit"]:
            # This is where we run the core logic from runner.py
            asyncio.run(run_high_level_task(user_input))
            
    except KeyboardInterrupt:
        logging.info("\nProcess interrupted by user.")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}", exc_info=True)
    finally:
        # This is critical for ensuring the browser always closes cleanly.
        if browser_session:
            logging.info("Closing browser session.")
            asyncio.run(browser_session.close())

if __name__ == "__main__":
    main()