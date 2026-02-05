
output "cloudfront_url" {
  description = "CloudFront URL (main entry point)"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "api_gateway_url" {
  description = "API Gateway direct URL"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "s3_bucket_name" {
  description = "S3 bucket for frontend"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = aws_ecr_repository.api.repository_url
}

output "deploy_frontend_command" {
  description = "Command to deploy frontend"
  value       = "aws s3 sync ./web/dist s3://${aws_s3_bucket.frontend.id} --delete"
}

output "invalidate_cache_command" {
  description = "Command to invalidate CloudFront cache"
  value       = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.main.id} --paths '/*'"
}
