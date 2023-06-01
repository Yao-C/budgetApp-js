pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....' 
                sh "rsync -u --delete --delete-excluded -r --exclude Jenkinsfile ./* pi@192.168.1.210:/var/www/html/budget-js"
            }
        }
    }
}