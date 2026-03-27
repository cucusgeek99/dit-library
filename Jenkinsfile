pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'dit-library'
        BACKEND_IMAGE        = 'dit-library-backend'
        FRONTEND_IMAGE       = 'dit-library-frontend'
    }

    stages {

        // ──────────────────────────────────────────────
        // Stage 1 : Checkout (automatique Jenkins)
        // ──────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo 'Recuperation du code source...'
                checkout scm
            }
        }

        // ──────────────────────────────────────────────
        // Stage 2 : Build Backend (virtualenv + deps)
        // ──────────────────────────────────────────────
        stage('Build Backend') {
            steps {
                echo 'Installation des dependances Python...'
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }

        // ──────────────────────────────────────────────
        // Stage 3 : Lint Backend
        // ──────────────────────────────────────────────
        stage('Lint Backend') {
            steps {
                echo 'Verification syntaxique du code Python...'
                dir('backend') {
                    sh '''
                        . venv/bin/activate
                        python -m py_compile main.py
                        python -m py_compile db/database.py
                        python -m py_compile models/models.py
                        python -m py_compile schemas/schemas.py
                        python -m py_compile crud/book.py
                        python -m py_compile crud/borrow.py
                        python -m py_compile crud/user.py
                        python -m py_compile auth/dependencies.py
                        echo "Aucune erreur de syntaxe Python"
                    '''
                }
            }
        }

        // ──────────────────────────────────────────────
        // Stage 4 : Build Frontend (lint + build)
        // ──────────────────────────────────────────────
        stage('Build Frontend') {
            steps {
                echo 'Installation des dependances Node.js...'
                dir('frontend') {
                    sh 'npm ci'
                }
                echo 'Lint du code JavaScript...'
                dir('frontend') {
                    sh 'npm run lint'
                }
                echo 'Build de production React...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // ──────────────────────────────────────────────
        // Stage 5 : Docker Build
        // ──────────────────────────────────────────────
        stage('Docker Build') {
            steps {
                echo 'Construction des images Docker...'
                sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"
                sh """
                    docker build \
                        --build-arg VITE_API_URL=/api \
                        -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${FRONTEND_IMAGE}:latest \
                        ./frontend
                """
            }
        }

        // ──────────────────────────────────────────────
        // Stage 6 : Deploy (docker-compose)
        // ──────────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo 'Deploiement des services...'
                sh 'docker-compose down --remove-orphans || true'
                sh 'docker-compose up -d --build'
                sh 'docker-compose ps'
            }
        }
    }

    // ──────────────────────────────────────────────
    // Post-actions
    // ──────────────────────────────────────────────
    post {
        success {
            echo '''
Pipeline termine avec succes !
  Frontend : http://localhost
  Backend  : http://localhost:8000/docs
            '''
        }
        failure {
            echo 'Pipeline echoue - Consultez les logs ci-dessus.'
            sh 'docker-compose logs --tail=50 || true'
        }
        always {
            echo 'Nettoyage de l\'environnement virtuel Python...'
            sh 'rm -rf backend/venv || true'
        }
    }
}
