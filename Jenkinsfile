pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/MrAhmed31/MEDISTOCK-PROJECT-NEST-AND-EXPREES'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t pharmacy-express .'
            }
        }

        stage('Stop Old Container') {
            steps {
                bat 'docker stop pharmacy-container || exit 0'
                bat 'docker rm pharmacy-container || exit 0'
            }
        }

        stage('Run New Container') {
            steps {
                bat 'docker run -d -p 5000:5000 --name pharmacy-container pharmacy-express'
            }
        }
    }
}