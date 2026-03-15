# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

- **Do NOT** open a public issue
- Email the maintainer directly or use GitHub's private vulnerability reporting

## Security Considerations

- API tokens and access credentials should only be stored in environment variables
- Never commit `.env` files or tokens to version control
- The MCP server communicates with the verification API over HTTPS
- All sensitive data (ID card numbers, phone numbers, bank card numbers) is transmitted encrypted and not stored locally
- Face comparison images are processed in memory and not persisted

## Best Practices

- Rotate your `DATA_VERIFY_ACCESS_TOKEN` periodically
- Use the minimum required permissions
- Monitor your API usage for unexpected patterns
- Do not log or store personally identifiable information (PII) in plain text
