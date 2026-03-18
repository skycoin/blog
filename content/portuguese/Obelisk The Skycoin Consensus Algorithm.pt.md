+++
title = "Obelisk: O Algoritmo de Consenso da Skycoin"
tags = [
    "Statement",
]
bounty = 8
date = "2017-09-08"
image = "img/obelisk-the-skycoin-consensus-algorithm.png"
aliases = [
	"/pt/statement/obelisk-the-skycoin-consensus-algorithm/"
]
+++

A blockchain da Skycoin faz uso de um novo tipo de algoritmo de consenso chamado
"Obelisk" que substitui a Prova de Trabalho ("PoW") e a Prova de Participação ("PoS").
"PoW" e "PoS" são as siglas inglesas para Proof of Work e Proof of Stake respetivamente.

O objetivo dos desenvolvedores da Skycoin foi corrigir as principais falhas de
segurança e "tendências centralizadoras" associadas às blockchains em que o
consenso se baseia em algoritmos PoW ou PoS e em que a criação de moedas está vinculada
a um processo de mineração. A Skycoin está, portanto, a tentar criar uma cryptomoeda
que melhor atenda a visão original de Satoshi de um sistema de moeda digital
completamente descentralizado.

Ao fazê-lo, a tecnologia Skycoin cria uma rede blockchain sem requisitos de
mineração, suprimentos fixos de cripto tokens, tempos de transação de 10 segundos
e maior segurança. Num sistema no qual a conexão entre criação de moeda e
controle sobre a rede é interrompida, os cripto tokens perdem a sua função
política e começam a agir mais como uma forma de propriedade digital no
sentido direto.


## Prova de trabalho e sistema da Bitcoin

Foi um erro de cálculo fundamental na programação inicial da Bitcoin que
o processo de mineração produziria uma estrutura de incentivo econômico que
promoveria a descentralização. Na verdade, a ligação entre consenso e hash
power incentiva a compra de capacidade de processamento cada vez maior para
controlar a rede de consenso.

A rede Bitcoin, por exemplo, é de facto controlada por três pools de mineração com
com fins lucrativos que conseguiram concentrar uma grande parte do hashing power
da rede nos seus servidores. Essas pools começaram a atuar como um cartel,
acordando dividir o hashing power entre si. A ligação entre mineração e o
controle da rede já foi identificado por Satoshi como a principal ameaça
não criptográfica à estabilidade da rede. Permite a atores acumular poder
de processamento suficiente e atingir uma taxa de hashing maioritária para
falsificar ou reverter transações na rede num ataque de 51%. Alguns argumentam que
esta vulnerabilidade tornou-se menos urgente num ambiente onde o poder de hash
é altamente centralizado com atores que investiram grandes somas na rede Bitcoin e
dependem do alto valor da moeda para a sua sobrevivência. Ainda assim o poder de
influenciar a rede está altamente concentrado, derrotando o propósito de uma
cryptomoeda baseada num livro-razão.

Portanto, o algoritmo PoW da rede Bitcoin introduz problemas de segurança e
de monopólio, colocando o poder sobre a rede do lado do ator capaz de mobilizar
recursos económicos suficientes para controlar o processo de mineração.

Isto também implica que operar a rede é ineficiente tanto económica como ambientalmente.
A entrada contínua de potência de processamento que é requerida pelo processo de mineração
usa grandes quantidades de eletricidade, implicando custos mensais na ordem das dezenas de milhões.
Estes custos só podem ser compensados com um influxo exponencialmente crescente de novos
capitais junto com novos utilizadors. Apenas um pequeno número de moedas bem estabelecidas,
como a Bitcoin e Ethereum, será capaz de atrair utilizadores suficientes para alcançar tal fluxo.
No caso da maioria das outras moedas baseadas em PoW/PoS, o custo da mineração PoW/PoS
é paga em uma avaliação de mercado mais baixa à medida que o dinheiro é sangrado de uma moeda
por custos de mineração até que a moeda seja abandonada.

>Neste momento, a economia da Bitcoin consiste em novos utilizadores a colocar o seu
dinheiro na rede e o dinheiro a ser lançado num poço e queimado num ritual de sacrifício
para os custos de eletricidade da mineração. Se o utilizador médio tivesse que pagar aos
mineradores os custos da eletricidade diretamente como taxas de transação, em vez de
lhes ser roubada através da inflação pela criação de novas moedas, então cada transação
da Bitcoin custaria mais de $50. Seria mais caro do que uma transferência bancária internacional.

## A tendência centralizadora da Prova de Participação (PoS)

Apesar de os algoritmos de Prova de Participação resolverem a questão de segurança
de ataques de 51%, eles são, sem dúvida, ainda mais vulneráveis à centralização do
que as redes PoW. Em PoS, o tamanho das participações em criptomoeda dos participantes
na rede determina a sua autoridade e poder de voto para implementar mudanças técnicas
na mesma. Os participantes podem minerar uma parcela equivalente à sua participação,
independentemente do poder de processamento.

Este princípio aumenta significativamente as barreiras económicas para lançar
um ataque de 51% porque o custo financeiro de adquirir a maioria dos tokens
na rede no mercado aberto é muito provável que exceda o ganho potencial.
Se um atacante terminar como o participante majoritário da rede, ele sofrerá
mais do impacto do ataque na estabilidade da rede ou do valor externo da criptomoeda.

No entanto, apesar de aumentar as barreiras aos ataques dirigidos por humanos na
rede, o PoS cria um impulso centralizador que é tão forte, se não mais forte,
como no caso da PoW. Tal como Joseph Young resume na sua comparação dos dois sistemas
em [coinfox.info] (http://www.coinfox.info/), "Um sistema em que o titular principal
goza de um controlo e autoridade extensivos sobre os aspectos técnicos e económicos
da rede cria um grande problema de monopólio." Enquanto num sistema PoW a votação sobre
a implementação de mudanças técnicas na rede "é dividida entre mineradores, desenvolvedores
e outros membros cruciais da comunidade", num sistema PoS, "os titulares principais
têm a capacidade técnica para fazer quaisquer mudanças que eles queiram, sem considerar
a vontade da comunidade, das empresas, dos mineradores e dos desenvolvedores. Essa
centralização do poder de voto e, essencialmente, do controlo da rede derrota o propósito
de uma cryptomoeda baseada em livros-razão, uma vez que contradiz todo seu princípio de
distribuição de todos os elementos da rede para evitar a presença de uma autoridade central".

## Obelisk: O Algoritmo de Consenso distribuido da Skycoin

Para enfrentar este problema de centralização, a Skycoin move-se além da PoW/PoS.
Usa um algoritmo de consenso distribuído, chamado Obelisk, que distribui influência
sobre a rede de acordo com uma "rede de confiança". Essencialmente, cada nodo possui
uma lista de outros nodos aos quais se inscreve e a densidade da rede de assinantes
de um nodo determina a sua influência na rede. A cada nodo é atribuída uma blockchain
pessoal que atua como um "canal de transmissão público" no qual todas as ações de um
nodo são visíveis e gravadas publicamente. À medida que todas as decisões de consenso
e comunicação ocorrem através das blockchain pessoais de cada nodo, a comunidade pode
facilmente auditar os nodos que são desonestos ou os que fazem conluio. As decisões na
rede e quais os nodos que influenciam essas decisões são completamente transparentes.

O registo público deixado pela blockchain pessoal de cada nodo permite que a rede
reaja às deserções cortando conexões com nodos menos confiáveis ou maliciosos,
contraindo a rede num núcleo menor e mais denso de nodos confiáveis. Portanto,
em princípio, se a comunidade não confia nos nodos que a representa ou sentem
que o poder dentro da rede está muito concentrado (ou não está concentrado o suficiente),
a comunidade pode mudar coletivamente o equilíbrio de poder na rede alterando
coletivamente as suas relações de confiança na rede. A responsabilidade dos nodos
para a comunidade e as auditorias de terceiros, bem como a transparência do consenso,
fortalecem a tomada de decisão coletiva e, portanto, introduzem um elemento altamente
democrático e descentralizado na rede.

Este sistema providência um sistema de moeda digital com tempos de transação
significativamente reduzidos, nenhum requisito de mineração e maior segurança.

*Consulte Mais informação:*


* *[Skycoin Consensus Algorithm Whitepapers](https://www.skycoin.com/whitepapers)*
* *[Obelisk: O Algoritmo de Consenso da Skycoin| Páginas informativas](/overview/obelisk-skycoin-consensus-algorithm-information-pages/)*
