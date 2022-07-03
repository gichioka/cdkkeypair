import "source-map-support/register"
import {Construct} from 'constructs'
import {App, CfnOutput, RemovalPolicy, Stack, StackProps, Token} from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HelloCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [{
        name: 'PublicSubnet',
        subnetType: ec2.SubnetType.PUBLIC,
      }],
    })

    // キーペア作成
    const cfnKeyPair = new ec2.CfnKeyPair(this, 'CfnKeyPair', {
      keyName: 'test-key-pair',
    })
    cfnKeyPair.applyRemovalPolicy(RemovalPolicy.DESTROY)

    // キーペア取得コマンドアウトプット
    new CfnOutput(this, 'GetSSHKeyCommand', {
      value: `aws ssm get-parameter --name /ec2/keypair/${cfnKeyPair.getAtt('KeyPairId')} --region ${this.region} --with-decryption --query Parameter.Value --output text`,
    })

    // EC2作成
    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.NANO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: Token.asString(cfnKeyPair.ref),
    })
    instance.connections.allowFromAnyIpv4(ec2.Port.tcp(22))
  }
}
 
