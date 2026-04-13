def predict_sleep_risk(sleep_hours, screen_time):

    if sleep_hours < 5:
        level = "High Risk"
        message = "Severe sleep deprivation detected. Immediate sleep recovery recommended."

    elif sleep_hours >= 5 and sleep_hours <= 7:
        level = "Moderate Risk"
        message = "Sleep duration slightly low. Improve sleep consistency."

    else:
        level = "Low Risk"
        message = "Healthy sleep pattern detected."

    if screen_time > 8:
        message += " High screen exposure may affect sleep quality."

    return level, message