+++
title = "스카이코인 BBS v5.0 출시 안내"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 1
date = "2017-12-18"
aliases = [
	"/ko/bbs/bbs-release-v5.0/"
]
+++

스카이코인 BBS v5.0가 많은 수정 끝에 드디어 출시되었습니다!

## 씬(Thin) 클라이언트

가장 큰 변화는, 씬(Thin) 클라이언트의 도입입니다. 이제 당신은 노드를 설정할 필요 없이 스카이코인 BBS에 접속할 수 있습니다!
단지 [bbs.skycoin.com](http://bbs.skycoin.com)로 가기만 하면 됩니다.

이전 버전에서는, 단지 한 사람만이 로컬로 제공되는 웹 사용자 인터페이스를 통해서만 컨텐츠에 접속/제출할 수 있었습니다.(그리고 해야만 했습니다.) 이 웹-인터페이스(및 그것을 호출하는 API)는 노드 자체를 직접 제어하고 노드(또는 서버 측)에 저장된 비공개키로 내용에 서명하므로 공개적으로 노출하는 것은 적절하지 않습니다.

따라서 씬 클라이언트를 도입하려면 사용자 관리와 컨텐츠 제출을 위해 서명하는 프로세스가 클라이언트측에서 처리되어야 합니다. 이를 위해서는 완전히 개선된 컨텐츠-제출 엔드 포인트(또는 엔드 포인트)와 프론트 엔드에 대한 많은 수정이 필요합니다.

새로운 콘텐츠 제출 프로세스에 대한 자세한 내용은 BBS Wiki에서 확인할 수 있습니다: [github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission-Process).

현재, 프론트-엔드는 매우 느리게 로드됩니다. 이것은 [GopherJS](https://github.com/gopherjs)를 사용 하여 시드 및 공개/개인 키 생성을 처리하고 데이터 서명 및 검증을 수행하기 때문에 발생합니다. 향후 버전에서는 기본 JavaScript 라이브러리를 사용하여 성능을 향상시킬 것입니다.

## 커맨드-라인 인터페이스

공개된 씬 클라이언트가 출시된 후에는 관리 제어를 처리하는 API 끝점을 제거하고 이러한 상호 작용을 처리 할 수있는 커맨드-라인 인터페이스를 도입했습니다.

이에 대한 자세한 내용은 여기서 확인할 수 있습니다: [github.com/skycoin/bbs/tree/master/cmd/bbscli](https://github.com/skycoin/bbs/tree/master/cmd/bbscli).

## 기타 개선사항

* 가져오기/내보내기 개선(불행히도 이것은 BBS v4.x의 가져오기/내보내기와 호환되지 않습니다.)
* 원격 제출 및 스카이코인 메신저와의 상호 작용에 대한 성능 향상을 위한 코드 단순화. 최신 메신저를 사용하도록 업데이트되었습니다.
* 향상된 파일-관리 성능.
* 유효하지 않은 CXO 루트 처리 향상.
* 연결단절에 대한 처리 향상.

## 다운로드

BBS를 다운로드하려면 [github.com/skycoin/bbs/releases](https://github.com/skycoin/bbs/releases)로 이동하십시오.(소스코드 또한 여기에 게시될 것입니다)

[bbs.skycoin.com](http://bbs.skycoin.com)을 통해 BBS에 액세스 할 수도 있습니다.

## 관련 문서

우리는 wiki 페이지를 시작했습니다. [github.com/skycoin/bbs/wiki](https://github.com/skycoin/bbs/wiki)

이 작업은 아직 진행 중입니다.

## 커뮤니티

우리의 텔레그램 채널: [@skycoinbbs](https://t.me/skycoinbbs).
