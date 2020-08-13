pipeline {
  agent none
  environment {
    WORKSPACE_SELF = ""
  }
  stages {
    stage('Test') {
      agent {
        docker {
          image 'cypress/base:12.14.1'
          args '-v $HOME/.cache/Cypress:/root/.cache/Cypress'
        }
      }
      steps {
        script {
          WORKSPACE_SELF = WORKSPACE
        }
        sh 'yarn install'
        sh 'yarn test:mocha'
      }
    }
  }
  post{
    always{
      node(label: 'master') {
        dir(WORKSPACE_SELF){
          withCredentials([string(credentialsId: 'oss-key', variable: 'KEY'), string(credentialsId: 'oss-secret', variable: 'SECRET'),]) {
            sh '''
            rm -rf test-report || true
            mkdir test-report
            mv mochawesome-report test-report/mochawesome-report
            mv cypress/screenshots test-report/screenshots
            mv cypress/videos test-report/videos
            tar -zcvf test-report-${BUILD_NUMBER}.tar.gz test-report

            ossutil64 cp -r test-report-${BUILD_NUMBER}.tar.gz <保存该压缩包的path> -e <保存该压缩包服务器域名> -i ${KEY} -k ${SECRET}
            '''
          }
        }

      }
    }
  }
}

