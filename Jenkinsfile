pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                bat 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                bat 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                bat 'npm start'
            }
        }
    }
}