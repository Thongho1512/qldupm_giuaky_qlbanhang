package com.giuakyqldupm.SalesManagement.service;

import com.giuakyqldupm.SalesManagement.entity.Order;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${mail.from}")
    private String fromEmail;

    @Value("${mail.from-name}")
    private String fromName;

    public void sendOrderConfirmationEmail(Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("customerName", order.getRecipientName());
            context.setVariable("orderId", order.getId());
            context.setVariable("orderDate",
                    order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            context.setVariable("shippingAddress", order.getShippingAddress());
            context.setVariable("recipientName", order.getRecipientName());
            context.setVariable("recipientPhone", order.getRecipientPhone());
            context.setVariable("paymentMethod", order.getPaymentMethod());
            context.setVariable("totalPrice", formatCurrency(order.getTotalPrice()));
            context.setVariable("items", order.getOrderItems());
            context.setVariable("formatCurrency", new FormatCurrencyFunction());

            String html = templateEngine.process("order-confirmation", context);

            helper.setFrom(fromEmail, fromName);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Xác nhận đơn hàng #" + order.getId());
            helper.setText(html, true);

            mailSender.send(message);

            log.info("Order confirmation email sent to: {}", order.getUser().getEmail());

        } catch (Exception e) {
            log.error("Failed to send order confirmation email", e);
        }
    }

    private String formatCurrency(java.math.BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(amount);
    }

    public static class FormatCurrencyFunction {
        public String format(java.math.BigDecimal amount) {
            NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            return formatter.format(amount);
        }
    }
}
