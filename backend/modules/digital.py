def calculate_digital_addiction(screen, sleep, social, exercise):

    score = (screen * 10) - (sleep * 5) - (social * 3) - (exercise * 4)

    if score < 20:
        level = "Low"
        message = "Healthy digital usage pattern."

    elif 20 <= score < 50:
        level = "Moderate"
        message = "Moderate digital dependency detected."

    else:
        level = "High"
        message = "High digital addiction risk. Reduce screen exposure."

    if score < 0:
        score = 0

    return level, score, message