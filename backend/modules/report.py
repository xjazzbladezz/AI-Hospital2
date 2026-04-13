from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import pagesizes
from reportlab.lib.units import inch
from datetime import datetime
import os

def generate_report(data_dict):

    file_path = "NeuroScope_Report.pdf"
    doc = SimpleDocTemplate(file_path, pagesize=pagesizes.A4)
    elements = []

    styles = getSampleStyleSheet()

    elements.append(Paragraph("NeuroScope Mental Health Assessment Report", styles["Heading1"]))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))

    table_data = [["Assessment", "Result"]]

    for key, value in data_dict.items():
        table_data.append([key, str(value)])

    table = Table(table_data, colWidths=[2.7 * inch, 2.7 * inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 0.5 * inch))

    elements.append(Paragraph("Doctor's Recommendation:", styles["Heading2"]))
    elements.append(Spacer(1, 0.2 * inch))

    elements.append(Paragraph(
        "Based on the above assessment, lifestyle modification is recommended. "
        "Improve sleep hygiene, reduce excessive screen exposure, maintain physical activity, "
        "and monitor mental workload regularly.",
        styles["Normal"]
    ))

    doc.build(elements)

    return file_path