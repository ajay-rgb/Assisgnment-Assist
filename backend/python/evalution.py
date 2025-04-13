import nltk
nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Preprocessing
def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    words = word_tokenize(text.lower())
    words = [lemmatizer.lemmatize(word) for word in words if word.isalnum()]
    words = [word for word in words if word not in stopwords.words("english")]
    return " ".join(words)

# Similarity scoring
def evaluate_answer(student_answer, reference_answer):
    student_answer = preprocess_text(student_answer)
    reference_answer = preprocess_text(reference_answer)
    student_embedding = model.encode([student_answer])[0]
    reference_embedding = model.encode([reference_answer])[0]
    similarity_score = cosine_similarity([student_embedding], [reference_embedding])[0][0]
    return similarity_score

# File processing
def evaluate_answer_files(answer_sheet_path, answer_key_path, output_path="results.txt"):
    with open(answer_sheet_path, "r", encoding="utf-8") as f1, open(answer_key_path, "r", encoding="utf-8") as f2:
        student_answers = f1.read().strip().splitlines()
        reference_answers = f2.read().strip().splitlines()

    assert len(student_answers) == len(reference_answers), "Mismatch in number of answers."

    with open(output_path, "w", encoding="utf-8") as out:
        for idx, (stud_ans, ref_ans) in enumerate(zip(student_answers, reference_answers), start=1):
            similarity = evaluate_answer(stud_ans.strip(), ref_ans.strip())
            marks = round(similarity * 5, 2)  # Score out of 5
            out.write(f"Q{idx} | Marks: {marks}/5\n")

    print(f"Evaluation complete. Results saved in '{output_path}'")
