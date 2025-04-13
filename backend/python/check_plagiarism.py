import sys
import json
from plagiarism_core import compare_new_submission_with_all
from typing import List, Dict, Any

def validate_input(text: str, previous_assignments: List[str]) -> None:
    """Validate input parameters"""
    if not isinstance(text, str):
        raise ValueError("Submission text must be a string")
    if not isinstance(previous_assignments, list):
        raise ValueError("Previous assignments must be a list")
    if any(not isinstance(x, str) for x in previous_assignments):
        raise ValueError("All previous assignments must be strings")

def main() -> None:
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        # Extract text and previous assignments with proper validation
        new_submission = data.get("text")
        previous_assignments = data.get("previous_assignments", [])
        
        # Validate input
        validate_input(new_submission, previous_assignments)
            
        # Run plagiarism check
        result = compare_new_submission_with_all(new_submission, previous_assignments)
        
        # Ensure results are JSON serializable and properly typed
        json_result = [
            {
                "index": int(item["index"]),
                "similarity": float(item["similarity"]),
                "plagiarised": bool(item["plagiarised"])
            }
            for item in result
        ]
            
        # Output JSON result
        print(json.dumps(json_result))
        sys.exit(0)
        
    except json.JSONDecodeError as e:
        print(json.dumps({
            "error": "Invalid JSON input",
            "details": str(e)
        }), file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(json.dumps({
            "error": "Invalid input data",
            "details": str(e)
        }), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "error": "Plagiarism check failed",
            "details": str(e)
        }), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
