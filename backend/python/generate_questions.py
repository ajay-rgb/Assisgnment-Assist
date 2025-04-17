import sys
import re
import torch
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer

def parse_generated_text(text: str) -> dict:
    clean_text = re.sub(r"\[/?INST\]", "", text)
    clean_text = re.sub(r"Question:\s*Question:", "Question:", clean_text)
    clean_text = clean_text.strip()

    match = re.search(r"Question:\s*(.*?)(?:\nHint:|Hint:)(.*)", clean_text, re.DOTALL)
    
    if match:
        question = match.group(1).strip().strip('\"').replace("Question:", "").strip()
        hint = match.group(2).strip().strip('\"')
    else:
        question = clean_text.strip()
        hint = "No hint available"

    return {
        "question": question,
        "hint": hint
    }


def generate_questions(topic, difficulty, types, count):
    try:
        model_path = "prajjwal888/Llama-2-7b-chat-finetune"
        model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        tokenizer = AutoTokenizer.from_pretrained(model_path)

        pipe = pipeline(
            task="text-generation",
            model=model,
            tokenizer=tokenizer,
            max_length=200,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )

        questions = []

        for _ in range(count):
            for q_type in types:
                prompt = (
                    f"Generate a {difficulty} difficulty {q_type} question about {topic}.\n"
                    "Format strictly as follows:\n"
                    "Question: <your question here>\n"
                    "Hint: <your hint here or \"No hint available\">"
                )

                formatted_prompt = f"<s>[INST] {prompt} [/INST]"

                result = pipe(formatted_prompt)

                generated_text = result[0]['generated_text'].replace(formatted_prompt, "").strip()
                parsed = parse_generated_text(generated_text)

                questions.append(f"**Type**: {q_type}\n\n**Question**: {parsed['question']}\n\n**Hint**: {parsed['hint']}\n\n---")

        return "\n".join(questions)

    except Exception as e:
        return f"Something went wrong: {e}"

if __name__ == '__main__':
    topic = sys.argv[1]
    difficulty = sys.argv[2]
    types = sys.argv[3].split(',')
    count = int(sys.argv[4])
    print(generate_questions(topic, difficulty, types, count))