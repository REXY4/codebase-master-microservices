  def repoUrl = "https://github.com/REXY4/codebase-master-microservices.git"
  def registryName = "be-master"
  def projectID = "express-service"
  def repoName = "${projectID}/${registryName}"
  def ms_Name = "deployment-auth"
  def registry = 'asia.gcr.io'
  pipeline{
    agent {
      kubernetes {
        label "jnlp-slave"
        defaultContainer "jnlp"
        yaml """
          apiVersion: v1
          kind: Pod
          metadata:
            labels:
              component: ci
          spec:
            serviceAccountName: default
            containers:
            - name: node
              image: node:12.6.0
              command:
              - cat
              tty: true
            - name: maven
              image: sonarsource/sonar-scanner-cli:latest
              command:
              - cat
              tty: true
            - name: helm
              image: alpine/helm:3.1.2
              command:
              - cat
              tty: true
            - name: docker
              image: docker:18.05-dind
              securityContext:
                privileged: true
              volumeMounts:
                - name: dind-storage
                  mountPath: /var/lib/docker
            volumes: 
            - name: dind-storage
              emptyDir: {}            
        """
      }
    }
    // options{
    // skipDefaultCheckout true
    //   gitlabBuilds(builds: ['checkout code', 'Build & Push Image','deploy'])
    // }
    stages {
   stage('Read Commit ID') {
     steps {
       script {
         sh "git rev-parse --short HEAD > .git/commit-id"
         commit_id = readFile('.git/commit-id').trim()
       }
     }
   }

   stage('Code Coverage') {
     environment {
       scannerHome = tool 'sonarscanner'
     }
     steps {
       script {
         try {
           container("maven") {
             script {
               withSonarQubeEnv('sonarqube') {
                 sh "sonar-scanner"
               }
             }
           }
         } catch (erro) {
           echo 'SCANNING ERROR : ' + erro.toString()
         }
       }
     }
   }

   stage('Build & Push Image') {
     post {
       failure {
         updateGitlabCommitStatus name: 'Build & Push Image', state: 'failed'
       }
       success {
         updateGitlabCommitStatus name: 'Build & Push Image', state: 'success'
       }
     }
     steps {
       script {
       container("docker"){
         docker.withRegistry("https://${registry}", 'gcr:express-service-dev') {
           def app = docker.build("${repoName}:${BUILD_NUMBER}.${commit_id}", '-f Dockerfile .').push()
         }
       }
       }
     }
   }
        
   stage('Deploy to development'){
        steps{
              container("helm"){    
              script{
                sh "pwd"
                sh "ls"
                sh """
                helm upgrade ${ms_Name} ./${ms_Name} \
                --set-string image.repository=${registry}/${repoName},image.tag=${BUILD_NUMBER}.${commit_id} \
                -f ./${ms_Name}/values.yaml --debug --install --namespace development
              """
              }
              }
            }
          }
            

  // Do not Delete curly branch
    }
  }
  
