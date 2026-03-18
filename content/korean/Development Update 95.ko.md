+++
title = "개발 업데이트 #95"
tags = [
    "Development",
]
date = "2016-01-06"
description = "스카이코인 관련 최신 개발동향 소개"
aliases = [
	"/ko/development-updates/development-update-95/"
]
+++

## 크로스 컴파일

##### 스카이코인을 크로스 컴파일 하려면 다음을 수행하십시오.:

Gox 설치:
https://github.com/mitchellh/gox 을 방문하십시오.
gox -build-toolchain

##### 컴파일:
cd $GOPATH/src/github.com/skycoin/skycoin
$G = skycoin-0.3
gox -output="$HOME/builds/$G-{{.OS}}-{{.Arch}}/$G/address_gen" ./address_gen/
gox -output="$HOME/builds/$G-{{.OS}}-{{.Arch}}/$G/skycoin" ./skycoin/

이것은 ARM 용 NaCl(기본 클라이언트)을 출력합니다.
- 기본 클라이언트는 Google이 브라우저 및 전화로 메모리 보안, 응용 프로그램을 실행하기 위한 실행용 샌드박스입니다.
- 이것은 네트워킹 및 디렉토리 액세스를 추상화 합니다.
- 이것은 Android 앱의 차세대 표준이며 플래시를 대체할 것입니다.
- 이것은 기본 클라이언트용 LLVM과 유사한 휴대용 기본 클라이언트입니다.

현재, 대부분의 거래소는 PHP와 원격 코드 실행 취약점을 포함하는 XML 기반 소프트웨어 라이브러리를 사용하고 있습니다.
새로운 악용사례가 매일마다 늘고 있으며, 기존의 취약점들도 발전하고 있습니다. 비트코인도 마찬가지입니다.

장기간 보안을 유지하려면, 가능한 한 기계에 가깝게 다가가야 합니다.
과도한 의존성에 대한 의존성을 없애기 위해 우리가 이것을 조작할 수 없는 비 메모리 보안 언어로 구현하였으며, 악용하거나 코드 라인 수를 줄일 수 없습니다.
- 라즈베리 파이 또는 ARM 하드웨어(마이크로 코드 악용 없음, MIPS 또는 RISC-V 지향)
- L4 커널(35,000라인, +2만 라인 대체, 공식적으로 입증됨, 사용자 공간의 모든 동작 및 드라이버)
- Libre 리눅스 드라이버 (바이너리 blobs을 대체하는 오픈소스 드라이버)
- 최종 빌드

이것은 적절한 보안과 지역 사용자를 위한 최소한의 요구사항입니다.
