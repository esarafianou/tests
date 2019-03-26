pipeline {
  agent {
    label 'prodsec'
  }
  stages {
      stage('Build') {
        steps {
          script {
            copyArtifacts projectName: 'auth0-configuration', filter: 'versions.json', selector: upstream()
            sh "docker build . -t auth0brokkr/security-node-check"
          }
        }
      }

      stage('Push') {
        environment {
          DOCKER_USER = credentials('docker-hub-user')
          DOCKER_PASSWORD = credentials('docker-hub-password')
        }

        steps {
          sh "docker login -u $DOCKER_USER -p $DOCKER_PASSWORD"
          script {
            sh "docker push auth0brokkr/security-node-check"
          }
        }
      }

      stage('Clean') {
        steps {
          script {
            sh "docker rmi auth0brokkr/security-node-check"
          }
        }
      }
  }

  post {
    // Always runs. And it runs before any of the other post conditions.
    always {
      // Let's wipe out the workspace before we finish!
      deleteDir()
    }
  }

  // The options directive is for configuration that applies to the whole job.
  options {
    // For example, we'd like to make sure we only keep 5 builds at a time, so
    // we don't fill up our storage!
    buildDiscarder(logRotator(numToKeepStr:'5'))

    // And we'd really like to be sure that this build doesn't hang forever, so
    // let's time it out.
    timeout(time: 30, unit: 'MINUTES')
  }
}
