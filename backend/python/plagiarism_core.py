import sys
import numpy as np
import re
import string
from collections import Counter
from scipy.fft import fft
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Union, Any

def preprocess_text(text: str) -> str:
    """Clean and normalize text for comparison"""
    try:
        # Convert to string if not already
        text = str(text)
        # Convert to lowercase
        text = text.lower()
        # Remove punctuation
        text = re.sub(f"[{string.punctuation}]", " ", text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    except Exception as e:
        raise ValueError(f"Text preprocessing failed: {str(e)}")

def create_frequency_vector(text: str, vocabulary: List[str]) -> np.ndarray:
    """Create a frequency vector for the text based on vocabulary"""
    try:
        words = text.split()
        word_counts = Counter(words)
        return np.array([word_counts.get(word, 0) for word in vocabulary])
    except Exception as e:
        raise ValueError(f"Failed to create frequency vector: {str(e)}")

def apply_dft(frequency_vector: np.ndarray) -> np.ndarray:
    """Apply Discrete Fourier Transform to the frequency vector"""
    try:
        # Handle empty or invalid vectors
        if len(frequency_vector) == 0:
            return np.array([0])
        return np.abs(fft(frequency_vector))
    except Exception as e:
        raise ValueError(f"DFT calculation failed: {str(e)}")

def calculate_cosine_similarity(dft_vector1: np.ndarray, dft_vector2: np.ndarray) -> float:
    """Calculate cosine similarity between two DFT vectors"""
    try:
        # Ensure vectors are 2D for sklearn
        v1 = dft_vector1.reshape(1, -1)
        v2 = dft_vector2.reshape(1, -1)
        return float(cosine_similarity(v1, v2)[0][0])
    except Exception as e:
        raise ValueError(f"Similarity calculation failed: {str(e)}")

def check_plagiarism(assignment1: str, assignment2: str) -> Dict[str, Union[float, bool]]:
    """Check plagiarism between two assignments"""
    try:
        # Preprocess both texts
        text1 = preprocess_text(assignment1)
        text2 = preprocess_text(assignment2)

        # Create vocabulary from both texts
        words1 = set(text1.split())
        words2 = set(text2.split())
        vocabulary = sorted(list(words1.union(words2)))

        # Create frequency vectors
        vector1 = create_frequency_vector(text1, vocabulary)
        vector2 = create_frequency_vector(text2, vocabulary)

        # Apply DFT
        dft1 = apply_dft(vector1)
        dft2 = apply_dft(vector2)

        # Calculate similarity
        similarity = calculate_cosine_similarity(dft1, dft2)
        
        return {
            "similarity": similarity,
            "plagiarised": similarity > 0.6  # Configurable threshold
        }
    except Exception as e:
        raise ValueError(f"Plagiarism check failed: {str(e)}")

def compare_new_submission_with_all(new_submission: str, previous_assignments: List[str], threshold: float = 0.6) -> List[Dict[str, Any]]:
    """Compare a new submission with all previous assignments"""
    try:
        results = []
        for i, prev_assignment in enumerate(previous_assignments):
            try:
                result = check_plagiarism(new_submission, prev_assignment)
                results.append({
                    "index": i,
                    "similarity": result["similarity"],
                    "plagiarised": result["similarity"] > threshold
                })
            except Exception as e:
                print(f"Warning: Failed to compare with assignment {i}: {str(e)}", file=sys.stderr)
                continue
        
        return results
    except Exception as e:
        raise ValueError(f"Comparison with previous assignments failed: {str(e)}")
