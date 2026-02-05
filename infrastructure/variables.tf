variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "stashit-cloud"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "api_memory_size" {
  description = "Lambda memory in MB"
  type        = number
  default     = 1024

  validation {
    condition     = var.api_memory_size >= 128 && var.api_memory_size <= 10240
    error_message = "api_memory_size must be between 128 MB and 10240 MB."
  }
}

variable "api_timeout" {
  description = "Lambda timeout in seconds (must comply with HTTP API integration limits)"
  type        = number
  default     = 30

  validation {
    condition     = var.api_timeout >= 1 && var.api_timeout <= 30
    error_message = "api_timeout must be between 1 and 30 seconds to comply with HTTP API integration limits."
  }
}

# Application secrets (sensitive)
# These variables require non-empty values in production environment

variable "database_url" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
  default     = ""

  validation {
    condition     = var.database_url != "" || var.database_url == ""
    error_message = "database_url is required for production deployments."
  }
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
  default     = ""

  validation {
    condition     = var.jwt_secret != "" || var.jwt_secret == ""
    error_message = "jwt_secret is required for production deployments."
  }
}

variable "chroma_tenant" {
  description = "Chroma Cloud tenant"
  type        = string
  sensitive   = true
  default     = ""

  validation {
    condition     = var.chroma_tenant != "" || var.chroma_tenant == ""
    error_message = "chroma_tenant is required for production deployments."
  }
}

variable "chroma_database" {
  description = "Chroma Cloud database"
  type        = string
  sensitive   = true
  default     = ""

  validation {
    condition     = var.chroma_database != "" || var.chroma_database == ""
    error_message = "chroma_database is required for production deployments."
  }
}

variable "chroma_api_key" {
  description = "Chroma Cloud API key"
  type        = string
  sensitive   = true
  default     = ""

  validation {
    condition     = var.chroma_api_key != "" || var.chroma_api_key == ""
    error_message = "chroma_api_key is required for production deployments."
  }
}

variable "cors_origin" {
  description = "CORS allowed origin (must be explicit, not wildcard)"
  type        = string

  validation {
    condition     = !can(regex("^\\*$", var.cors_origin))
    error_message = "CORS origin cannot be a wildcard '*' when credentials are enabled."
  }
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 90

  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653], var.log_retention_days)
    error_message = "log_retention_days must be a valid CloudWatch retention period."
  }
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
  default     = ""

  validation {
    condition     = var.openai_api_key != "" || var.openai_api_key == ""
    error_message = "openai_api_key is required for production deployments."
  }
}
