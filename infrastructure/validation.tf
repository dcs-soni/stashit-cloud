# Production environment validation
# Terraform variable validation cannot reference other variables,
# so we use lifecycle preconditions to validate secrets in production

locals {
  is_production = var.environment == "production"

  # Collect all validation errors
  secret_validations = {
    database_url    = local.is_production && trimspace(var.database_url) == ""
    jwt_secret      = local.is_production && trimspace(var.jwt_secret) == ""
    chroma_tenant   = local.is_production && trimspace(var.chroma_tenant) == ""
    chroma_database = local.is_production && trimspace(var.chroma_database) == ""
    chroma_api_key  = local.is_production && trimspace(var.chroma_api_key) == ""
    openai_api_key  = local.is_production && trimspace(var.openai_api_key) == ""
  }

  missing_secrets = [for k, v in local.secret_validations : k if v]
}

# This check runs during terraform plan/apply and fails if secrets are missing
check "production_secrets_required" {
  assert {
    condition     = length(local.missing_secrets) == 0
    error_message = "Production deployment requires all secrets. Missing: ${join(", ", local.missing_secrets)}"
  }
}
