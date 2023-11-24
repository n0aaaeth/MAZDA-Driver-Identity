# MAZDA Driver Identity
![img5](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img5.png)
![img3](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img3.png)
![img4](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img4.png)

## 特徴 ①：ERC6551M

#### ERC6551M 概要
ERC6551を活用したDynamic NFTの開発に最適化されたERC規格を独自実装。この規格を活用することで、TBA内のNFTに「有効/無効」の状態フラグを設定し、オンチェーンでその状態を容易に確認が可能。ERC721とERC1155規格に準拠し、後方互換性を維持しつつ、アセットの装着状態を効率的に管理できる。

#### 技術的特徴
- **アセットの装着状況の選択的開示**: ユーザーは自身のアセット装着状態をDapp間で選択的に公開し、状態の共有及び同期を行うことが可能
- **メタトランザクション対応**: メタトランザクションを通じて、ユーザーはガス代を気にすることなくトランザクションを行うことが可能

#### 提供価値
- **ユーザビリティ**: メタトランザクションを利用することで、ガス代の心配なしにアセットの状態を容易に変更できる
- **Dapp間の相互運用性**: ERC6551Mを活用することで、異なるDapp間でユーザー自身のアセットの装着状況を共有できるため、Dapp間を横断したUXの実現が可能

![img2](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img2.png)



## 特徴 ②：SessionKey 

#### Session Key 概要
ユーザーが指定したトランザクションのみを実行し、セッション期間を通じて限定されたアクションを可能にするSessionKeyModuleを実装。これにより、ユーザーの予期しないトランザクションの実行を防ぎつつ、トランザクションごとの署名プロセスを簡素化し、安全性と利便性の両方を確保することが可能。

#### 技術的特徴
- **トランザクション制御**: セッションキーにより、ユーザーは事前に許可したトランザクションのみを実行でき、セッション外のトランザクションは無効化
- **セッション期間管理**: ユーザーはセッションの期間を設定でき、期間内に制限されたトランザクションの実行が可能
- **メタトランザクション対応**: メタトランザクションを通じてセッションキーの作成が簡略化され、ユーザーはガス代の心配なくセッションを開始できる

#### 提供価値
- **セキュリティ向上**：　ユーザー自身が事前に許可したトランザクションの範囲内でのみ操作を許可し、予期しないトランザクションの実行を防ぐ
- **ユーザー体験の簡素化**：　ユーザーは毎回のトランザクションごとに署名を行う必要がなくなり、ユーザーエクスペリエンスが簡素化される

![img1](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img1.png)

## デモ（プロダクト解説）
https://youtu.be/vV0Q_-RLq3E?si=8G1V6A_2GwDo_Ur4
