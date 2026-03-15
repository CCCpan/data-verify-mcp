# Contributing

Thank you for your interest in contributing to Data Verify MCP Server!

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## Development Setup

```bash
git clone https://github.com/pancheng/data-verify-mcp.git
cd data-verify-mcp
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Keep tool descriptions clear and bilingual (English + Chinese)

## Reporting Issues

Please use [GitHub Issues](https://github.com/pancheng/data-verify-mcp/issues) to report bugs or request features.

## Security

- **Never** commit API tokens or credentials
- Use environment variables for sensitive configuration
- See [SECURITY.md](SECURITY.md) for vulnerability reporting
