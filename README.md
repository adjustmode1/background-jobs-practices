# Setup 
## Minio 
1. Create buckage: `email-storage`
2. mc alias set local http://localhost:9000 minioadmin minioadmin123
3. mc event add local/email-storage-temp arn:minio:sqs::_:amqp --event put
