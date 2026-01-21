package com.food.foodorder.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.food.foodorder.entity.Order;
import com.food.foodorder.entity.OrderItem;

import jakarta.mail.internet.MimeMessage;

// iText imports
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send order confirmation email when order is placed
     */
    public void sendOrderPlacedEmail(Order order, String userEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(userEmail);
            message.setSubject("🎉 Order Confirmed - GROGOS Order #" + order.getId());

            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear Customer,\n\n");
            emailBody.append("Thank you for ordering from GROGOS!\n");
            emailBody.append("Your order has been placed successfully.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("ORDER DETAILS\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("Order ID: #").append(order.getId()).append("\n");
            emailBody.append("Order Date: ")
                     .append(order.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")))
                     .append("\n");
            emailBody.append("Status: ").append(order.getStatus()).append("\n\n");

            emailBody.append("ITEMS ORDERED:\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            for (OrderItem item : order.getOrderItems()) {
                emailBody.append(String.format("%-30s x%-5d ₹%,.2f\n",
                        item.getFood().getName(),
                        item.getQuantity(),
                        item.getPrice() * item.getQuantity()));
            }

            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append(String.format("TOTAL AMOUNT:                    ₹%,.2f\n\n", order.getTotalAmount()));

            emailBody.append("We will notify you when your order is confirmed and out for delivery.\n\n");
            emailBody.append("Thank you for choosing GROGOS! 🛒\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("GROGOS Team\n");
            emailBody.append("Your Quick Commerce Partner");

            message.setText(emailBody.toString());
            mailSender.send(message);

            System.out.println("✅ Order placed email sent to: " + userEmail);

        } catch (Exception e) {
            System.err.println("❌ Failed to send order placed email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send order status update email
     * Attach invoice when status is OUT_FOR_DELIVERY
     */
    public void sendOrderStatusUpdateEmail(Order order, String userEmail, String newStatus) {
        try {
            boolean attachInvoice = "OUT_FOR_DELIVERY".equalsIgnoreCase(newStatus);

            if (attachInvoice) {
                sendEmailWithInvoice(order, userEmail);
            } else {
                sendSimpleStatusEmail(order, userEmail, newStatus);
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to send status update email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Simple status update email (no attachment)
     */
    private void sendSimpleStatusEmail(Order order, String userEmail, String newStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("📦 Order Update - GROGOS Order #" + order.getId());

        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Dear Customer,\n\n");
        emailBody.append("Your order status has been updated!\n\n");
        emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        emailBody.append("Order ID: #").append(order.getId()).append("\n");
        emailBody.append("New Status: ").append(newStatus.replace("_", " ")).append("\n");
        emailBody.append("Total Amount: ₹").append(String.format("%,.2f", order.getTotalAmount())).append("\n\n");

        switch (newStatus.toUpperCase()) {
            case "CONFIRMED":
                emailBody.append("✅ Great news! Your order has been confirmed.\n");
                emailBody.append("We are preparing your items and will notify you when they're out for delivery.\n");
                break;
            case "DELIVERED":
                emailBody.append("🎉 Your order has been delivered successfully!\n");
                emailBody.append("We hope you enjoy your items. Thank you for choosing GROGOS!\n");
                break;
            case "CANCELLED":
                emailBody.append("❌ Your order has been cancelled.\n");
                emailBody.append("If you have any questions, please contact our support team.\n");
                break;
            default:
                emailBody.append("Your order is being processed.\n");
        }

        emailBody.append("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        emailBody.append("Thank you for shopping with GROGOS! 🛒\n\n");
        emailBody.append("Best regards,\n");
        emailBody.append("GROGOS Team");

        message.setText(emailBody.toString());
        mailSender.send(message);

        System.out.println("✅ Status update email sent to: " + userEmail + " | Status: " + newStatus);
    }

    /**
     * Send email with invoice PDF attachment (for OUT_FOR_DELIVERY)
     */
    private void sendEmailWithInvoice(Order order, String userEmail) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setSubject("🚚 Out for Delivery - GROGOS Order #" + order.getId() + " Invoice");

        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Dear Customer,\n\n");
        emailBody.append("Great news! Your order is out for delivery! 🚚\n\n");
        emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        emailBody.append("Order ID: #").append(order.getId()).append("\n");
        emailBody.append("Status: OUT FOR DELIVERY\n");
        emailBody.append("Expected Delivery: Within 30-45 minutes\n");
        emailBody.append("Total Amount: ₹").append(String.format("%,.2f", order.getTotalAmount())).append("\n\n");
        emailBody.append("Your invoice is attached to this email for your records.\n\n");
        emailBody.append("Thank you for choosing GROGOS! 🛒\n\n");
        emailBody.append("Best regards,\n");
        emailBody.append("GROGOS Team");

        helper.setText(emailBody.toString());

        // Generate real PDF invoice
        byte[] invoicePdf = generateInvoicePDF(order);
        ByteArrayResource invoiceResource = new ByteArrayResource(invoicePdf);
        helper.addAttachment("GROGOS_Invoice_" + order.getId() + ".pdf", invoiceResource);

        mailSender.send(mimeMessage);

        System.out.println("✅ OUT_FOR_DELIVERY email with invoice sent to: " + userEmail);
    }

    /**
     * Generate real PDF invoice using iText
     */
    private byte[] generateInvoicePDF(Order order) throws Exception {

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);
        document.open();

        document.add(new Paragraph("GROGOS - TAX INVOICE"));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Invoice No: INV-" + order.getId()));
        document.add(new Paragraph("Order ID: #" + order.getId()));
        document.add(new Paragraph("Order Date: " +
                order.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))));
        document.add(new Paragraph("Status: " + order.getStatus()));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("ITEMS ORDERED:"));
        document.add(new Paragraph("----------------------------------------------------"));

        for (OrderItem item : order.getOrderItems()) {
            document.add(new Paragraph(
                    item.getFood().getName() + "  x" + item.getQuantity() +
                            "  = ₹" + String.format("%,.2f", item.getPrice() * item.getQuantity())
            ));
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("----------------------------------------------------"));
        document.add(new Paragraph("TOTAL AMOUNT: ₹" + String.format("%,.2f", order.getTotalAmount())));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Thank you for shopping with GROGOS!"));
        document.add(new Paragraph("For support: support@grogos.com"));

        document.close();
        return outputStream.toByteArray();
    }
}
