#!/usr/bin/env groovy

/**
 * Jenkinsfile for Modules Platform Monorepo
 *
 * Orchestrates build, test, and deployment for packages and services.
 * Uses Nx for parallelized task execution.
 */

pipeline {
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: agent
spec:
  serviceAccountName: jenkins
  containers:
    - name: nodejs
      image: node:22.15.3
      command:
        - cat
      tty: true
      resources:
        requests:
          memory: "1Gi"
          cpu: "500m"
        limits:
          memory: "2Gi"
          cpu: "1000m"
    - name: docker
      image: docker:25-dind
      securityContext:
        privileged: true
      resources:
        requests:
          memory: "512Mi"
          cpu: "250m"
        limits:
          memory: "1Gi"
          cpu: "500m"
  restartPolicy: Never
'''
    }
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
    timeout(time: 60, unit: 'MINUTES')
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    NODE_ENV = 'test'
    PNPM_HOME = "${WORKSPACE}/.pnpm"
    PATH = "${WORKSPACE}/.pnpm:${PATH}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          env.GIT_BRANCH_NAME = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
        }
      }
    }

    stage('Setup') {
      steps {
        container('nodejs') {
          script {
            sh '''
              set -e

              # Install pnpm
              npm install -g pnpm@10.32.1

              # Display versions
              echo "=== Versions ==="
              node --version
              npm --version
              pnpm --version

              # Install dependencies
              echo "=== Installing Dependencies ==="
              pnpm install --frozen-lockfile
            '''
          }
        }
      }
    }

    stage('Lint') {
      steps {
        container('nodejs') {
          script {
            sh '''
              set -e
              echo "=== Linting Code ==="
              pnpm nx run-many --target=lint --all --skip-nx-cache
            '''
          }
        }
      }
    }

    stage('Type Check') {
      steps {
        container('nodejs') {
          script {
            sh '''
              set -e
              echo "=== Type Checking ==="
              pnpm nx run-many --target=typecheck --all --skip-nx-cache
            '''
          }
        }
      }
    }

    stage('Test') {
      steps {
        container('nodejs') {
          script {
            sh '''
              set -e
              echo "=== Running Tests ==="
              pnpm nx run-many --target=test --all --skip-nx-cache
            '''
          }
        }
      }
    }

    stage('Build') {
      steps {
        container('nodejs') {
          script {
            sh '''
              set -e
              echo "=== Building Packages ==="
              pnpm nx run-many --target=build --all --skip-nx-cache
            '''
          }
        }
      }
    }

    stage('Build Docker Images') {
      when {
        branch 'main'
      }
      steps {
        container('docker') {
          script {
            sh '''
              set -e
              echo "=== Building Docker Images ==="
              pnpm nx run-many --target=docker:build --all --skip-nx-cache || true
            '''
          }
        }
      }
    }

    stage('Deploy to Staging') {
      when {
        branch 'develop'
      }
      steps {
        script {
          echo "=== Deploying to Staging ==="
          // Staging deployment steps
          echo "Staging deployment would go here"
        }
      }
    }

    stage('Deploy to Production') {
      when {
        branch 'main'
      }
      input {
        message "Deploy to production?"
        ok "Deploy"
      }
      steps {
        script {
          echo "=== Deploying to Production ==="
          // Production deployment steps
          echo "Production deployment would go here"
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }

    failure {
      script {
        echo "Pipeline failed on branch: ${GIT_BRANCH_NAME}"
        echo "Commit: ${GIT_COMMIT_SHORT}"
      }
    }

    success {
      script {
        echo "Pipeline succeeded on branch: ${GIT_BRANCH_NAME}"
        echo "Commit: ${GIT_COMMIT_SHORT}"
      }
    }
  }
}
