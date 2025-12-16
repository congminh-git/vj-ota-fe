pipeline {
    agent any
    
    environment {
        PROJECT_NAME = 'ota-fe'
        DOCKER_PORT = '6300:3000'
        NEXT_PUBLIC_PUBLICAPI_URL = "${env.NEXT_PUBLIC_PUBLICAPI_URL ?: 'https://api.skyjet-ota.site'}"
    }
    
    stages {
        stage('Build') {
            steps {
                script {
                    echo "Building ${PROJECT_NAME}..."
                    sh '''
                        cd ${WORKSPACE}
                        docker build \
                          --build-arg NEXT_PUBLIC_PUBLICAPI_URL=${NEXT_PUBLIC_PUBLICAPI_URL} \
                          -t ${PROJECT_NAME} .
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "Stopping and removing existing container..."
                    sh '''
                        docker stop ${PROJECT_NAME} || true
                        docker rm ${PROJECT_NAME} || true
                    '''
                    
                    echo "Starting new container..."
                    sh '''
                        docker run -dp ${DOCKER_PORT} \\
                            --restart unless-stopped \\
                            --name ${PROJECT_NAME} \\
                            ${PROJECT_NAME}
                    '''
                }
            }
        }
        
        stage('Logs') {
            steps {
                script {
                    sh '''
                        echo '' > ${WORKSPACE}/${PROJECT_NAME}.txt
                        nohup docker logs ${PROJECT_NAME} -f >> ${WORKSPACE}/${PROJECT_NAME}.txt &
                        sleep 2
                        docker logs ${PROJECT_NAME}
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo "Build completed successfully!"
            echo "Container: ${PROJECT_NAME}"
            echo "Port: ${DOCKER_PORT}"
        }
        failure {
            echo "Build failed!"
        }
        always {
            // Cleanup can be added here if needed
        }
    }
}

