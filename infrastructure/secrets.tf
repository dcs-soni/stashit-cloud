# AWS Secrets Manager for sensitive configuration
resource "aws_secretsmanager_secret" "api_secrets" {
  name                    = "${var.project_name}-api-secrets-${var.environment}"
  description             = "Sensitive configuration for the API Lambda function"
  recovery_window_in_days = var.environment == "production" ? 30 : 0

  tags = { Component = "API" }
}

resource "aws_secretsmanager_secret_version" "api_secrets" {
  secret_id = aws_secretsmanager_secret.api_secrets.id
  secret_string = jsonencode({
    DATABASE_URL    = var.database_url
    JWT_SECRET      = var.jwt_secret
    CHROMA_TENANT   = var.chroma_tenant
    CHROMA_DATABASE = var.chroma_database
    CHROMA_API_KEY  = var.chroma_api_key
    OPENAI_API_KEY  = var.openai_api_key
  })
}
