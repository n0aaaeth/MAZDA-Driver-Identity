# 🌐 MAZDA Driver Identity
![img6](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img6.png)
![img3](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img3.png)
![img4](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img4.png)

## ⛓ 構築環境（ブロックチェーン）
Astar zkEVM (zKatana)
![img8](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img8.png)

## 🤖 プロダクト解説
https://www.youtube.com/watch?v=vV0Q_-RLq3E

## 💡 デモ
https://youtu.be/upj7EN2gNzU

## 🖥 特徴①：ERC6551M
https://zkatana.blockscout.com/address/0x924f406F2A3cED38bd57b99C0439aC74C078d376?tab=internal_txns

#### ERC6551M 概要
ERC6551を活用したDynamic NFTの開発に最適化されたERC規格を独自実装。この規格を活用することで、TBA内のNFTに「有効/無効」の状態フラグを設定し、オンチェーンでその状態を容易に確認可能。ERC721とERC1155規格に準拠し、後方互換性を維持しつつ、アセットの装着状態を効率的に管理できる。

#### 技術的特徴
- **TBAに対する動的なアセット管理**: ユーザーはTBAに対して自身のアセットの装着状態を動的に開示でき、シームレスにDapp間でのアセットの状態共有が可能
- **メタトランザクションによるシームレスな操作**: ユーザーはガス代の心配なく、メタトランザクションを利用してアセットの状態変更をシームレスに行うことが可能

#### 提供価値
- **ユーザビリティ**: メタトランザクションを利用することで、ガス代の心配なしにアセットの状態を容易に変更できる
- **Dapp間の相互運用性**: ERC6551Mを活用することで、異なるDapp間でユーザー自身のTBAとそのアセット装着状態をリアルタイムに共有でき、Dapp間を横断したUXの提供が可能

![img2](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img2.png)


## 🖥 特徴②：SessionKey 
https://zkatana.blockscout.com/address/0x197dA1573AA8997aB241982e3a81Fd5F74B1bF74?tab=internal_txns

#### SessionKey 概要
ユーザーが事前に指定したトランザクションの範囲内で、セッション期間を通じて限定されたアクションを可能にするSessionKeyを実装。これにより、ユーザーの予期しないトランザクションの実行を防ぎつつ、トランザクションごとの署名プロセスを簡素化し、安全性と利便性の両方を確保することが可能。

#### 技術的特徴
- **トランザクション制御**: SessionKeyにより、ユーザーが事前に許可したトランザクションのみを実行でき、セッション外のトランザクションは無効化
- **セッション期間管理**: ユーザーはセッションの期間を設定でき、期間内に制限されたトランザクションの実行が可能
- **メタトランザクション対応**: メタトランザクションを通じてSessionKeyの作成が簡略化され、ユーザーはガス代の心配なくセッションを開始できる

#### 提供価値
- **セキュアでシームレスなトランザクション管理**：ユーザー自身が事前に許可したトランザクションの範囲内でのみ操作を許可し、予期しないトランザクションの実行を防ぐ
- **ユーザー体験の簡素化**：ユーザーは毎回のトランザクションごとに署名を行う必要がなくなりUXが簡素化される（トランザクションの手間を削減）

![img1](https://raw.githubusercontent.com/n0aaaeth/MAZDA-Driver-Identity/main/images/img1.png)



