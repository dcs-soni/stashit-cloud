
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "stashit-cloud"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
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
}

variable "api_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

# Application secrets (sensitive)
variable "database_url" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
  default     = ""
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "chroma_tenant" {
  description = "Chroma Cloud tenant"
  type        = string
  sensitive   = true
  default     = ""
}

variable "chroma_database" {
  description = "Chroma Cloud database"
  type        = string
  sensitive   = true
  default     = ""
}

variable "chroma_api_key" {
  description = "Chroma Cloud API key"
  type        = string
  sensitive   = true
  default     = ""
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
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
  default     = ""
}
