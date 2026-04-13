from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.platypus import Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from datetime import datetime

def generate_report(data_dict):

    file_path = "NeuroScope_Report.pdf"
    doc = SimpleDocTemplate(file_path, pagesize=A4,
                            rightMargin=40, leftMargin=40,
                            topMargin=40, bottomMargin=30)

    elements = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="TitleStyle",
        fontSize=18,
        alignment=1,
        spaceAfter=10
    )

    header_style = ParagraphStyle(
        name="HeaderStyle",
        fontSize=12,
        spaceAfter=6
    )

    normal_center = ParagraphStyle(
        name="NormalCenter",
        alignment=1
    )

    elements.append(Paragraph("SABAS Chikitsa Kendra", title_style))
    elements.append(Paragraph("Mental Health Assessment Report", normal_center))
    elements.append(Spacer(1, 0.2 * inch))

    elements.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%d-%m-%Y')}", header_style))
    elements.append(Paragraph(f"<b>Time:</b> {datetime.now().strftime('%H:%M:%S')}", header_style))

    elements.append(Spacer(1, 0.3 * inch))

    elements.append(Paragraph("<b>Patient Assessment Summary</b>", styles["Heading3"]))
    elements.append(Spacer(1, 0.2 * inch))

    table_data = [["Assessment Parameter", "Result"]]

    for key, value in data_dict.items():
        table_data.append([key, str(value)])

    table = Table(table_data, colWidths=[3 * inch, 2.5 * inch])

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2E86C1")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),

        ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),

        ("ALIGN", (0, 0), (-1, -1), "CENTER"),

        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(Paragraph("<b>Doctor's Recommendation</b>", styles["Heading3"]))
    elements.append(Spacer(1, 0.2 * inch))

    elements.append(Paragraph(
        "The patient shows signs that require moderate lifestyle adjustments. "
        "It is advised to maintain a proper sleep cycle, reduce prolonged screen exposure, "
        "engage in physical activity, and monitor mental stress levels regularly. "
        "Follow-up assessment is recommended.",
        styles["Normal"]
    ))

    elements.append(Spacer(1, 0.6 * inch))

    elements.append(Paragraph("__________________________", styles["Normal"]))
    elements.append(Paragraph("Authorized Medical Officer", styles["Normal"]))

    doc.build(elements)

    return file_path