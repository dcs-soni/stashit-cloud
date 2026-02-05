resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api-${var.environment}"
  role          = aws_iam_role.lambda_execution.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.api.repository_url}:latest"
  memory_size   = var.api_memory_size
  timeout       = var.api_timeout
  publish       = true

  environment {
    variables = {
      NODE_ENV           = var.environment == "production" ? "production" : "development"
      CORS_ORIGIN        = var.cors_origin
      # Secrets are loaded from AWS Secrets Manager at runtime
      AWS_SECRETS_ARN    = aws_secretsmanager_secret.api_secrets.arn
    }
  }

  tracing_config {
    mode = "Active"
  }

  lifecycle {
    ignore_changes = [image_uri]
  }

  depends_on = [
    aws_ecr_repository.api,
    aws_iam_role_policy_attachment.lambda_basic,
    aws_secretsmanager_secret_version.api_secrets
  ]

  tags = { Component = "API" }
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = var.log_retention_days

  tags = { Component = "API" }
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
