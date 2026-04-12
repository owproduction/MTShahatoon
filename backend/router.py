def detect_intent(message: str, has_image: bool = False):
    msg = message.lower()
    
    if any(w in msg for w in ["нарисуй", "сгенерируй картинку", "создай изображение", "image gen"]):
        return "image_gen"
    if has_image:
        return "vision"
    if any(w in msg for w in ["найди в интернете", "погугли", "поиск", "новости", "веб"]):
        return "web_search"
    if any(w in msg for w in ["проанализируй файл", "прочитай документ", "реферат", "конспект"]):
        return "file_analysis"
    return "text"