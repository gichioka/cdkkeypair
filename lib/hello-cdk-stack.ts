import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HelloCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
 
     const vpc = new ec2.Vpc(this, 'TheVPC', {
      cidr: "10.0.0.0/16"
    })

    const i = new ec2.Instance(this, id, {
      instanceType: new ec2.InstanceType("t2.medium"),
      machineImage: new ec2.AmazonLinuxImage,
      vpc: vpc,
    })
  }
}


