"""
PDF report generator using ReportLab.
Generates a clean financial summary PDF for a given month/year.
"""
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)


BRAND_COLOR   = colors.HexColor('#6366f1')
HEADER_COLOR  = colors.HexColor('#1e1b4b')
INCOME_COLOR  = colors.HexColor('#22c55e')
EXPENSE_COLOR = colors.HexColor('#ef4444')
SAFE_COLOR    = colors.HexColor('#10b981')


def generate_pdf_report(user, transactions, summary, month, year):
    """
    Build and return a BytesIO PDF buffer.
    Parameters
    ----------
    user         : CustomUser instance
    transactions : QuerySet of Transaction
    summary      : dict with total_income, total_expenses, savings keys
    month, year  : int
    """
    buffer = io.BytesIO()
    doc    = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()
    story  = []

    # ── Title ──────────────────────────────────────────────────────────────
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        textColor=HEADER_COLOR,
        fontSize=20,
        spaceAfter=4,
    )
    story.append(Paragraph('Personal Finance Tracker', title_style))
    story.append(Paragraph(
        f'Monthly Report — {month}/{year}', styles['Heading2']
    ))
    story.append(Paragraph(
        f'User: {user.get_full_name()} ({user.email})', styles['Normal']
    ))
    story.append(Spacer(1, 0.5 * cm))

    # ── Summary Table ───────────────────────────────────────────────────────
    summary_data = [
        ['Metric', 'Amount'],
        ['Total Income',   f"₹{float(summary['total_income']):,.2f}"],
        ['Total Expenses', f"₹{float(summary['total_expenses']):,.2f}"],
        ['Net Savings',    f"₹{float(summary['savings']):,.2f}"],
    ]
    t = Table(summary_data, colWidths=[8 * cm, 8 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND',  (0, 0), (-1, 0), BRAND_COLOR),
        ('TEXTCOLOR',   (0, 0), (-1, 0), colors.white),
        ('FONTNAME',    (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',    (0, 0), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('GRID',        (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('ALIGN',       (1, 0), (1, -1), 'RIGHT'),
        ('TOPPADDING',  (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.5 * cm))

    # ── Transaction Detail Table ────────────────────────────────────────────
    story.append(Paragraph('Transaction Details', styles['Heading3']))
    story.append(Spacer(1, 0.2 * cm))

    txn_data = [['Date', 'Type', 'Category', 'Amount (₹)', 'Description']]
    for txn in transactions:
        txn_data.append([
            str(txn.date),
            txn.transaction_type.capitalize(),
            txn.category.name if txn.category else 'N/A',
            f"{float(txn.amount):,.2f}",
            (txn.description[:40] + '...') if len(txn.description) > 40
            else txn.description,
        ])

    if len(txn_data) > 1:
        t2 = Table(txn_data, colWidths=[2.5*cm, 2.5*cm, 4*cm, 3*cm, 5*cm])
        t2.setStyle(TableStyle([
            ('BACKGROUND',    (0, 0), (-1, 0), BRAND_COLOR),
            ('TEXTCOLOR',     (0, 0), (-1, 0), colors.white),
            ('FONTNAME',      (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE',      (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
            ('GRID',          (0, 0), (-1, -1), 0.3, colors.HexColor('#e2e8f0')),
            ('ALIGN',         (3, 0), (3, -1), 'RIGHT'),
        ]))
        story.append(t2)
    else:
        story.append(Paragraph('No transactions found for this period.', styles['Normal']))

    doc.build(story)
    buffer.seek(0)
    return buffer
