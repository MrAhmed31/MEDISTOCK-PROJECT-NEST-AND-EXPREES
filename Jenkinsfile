pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pharmacy-express .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop pharmacy-container || true'
                sh 'docker rm pharmacy-container || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 5000:5000 --name pharmacy-container pharmacy-express'
            }
        }
    }
}