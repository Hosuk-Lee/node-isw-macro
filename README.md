# node-isw-macro
isw macro


# develop enviroment
$ node --version
v19.7.0

# 실행
1. 데이터 작업 (dat 디렉토리)<br>
localIdentifier	type	label	shortLabel	notes	decimalPlaces	selectionElements<br>
country_code,text,국가코드,국가코드,국가코드,,<br>
amount,decimal,금액,금액,금액,2,<br>

2. 매크로실행<br>
$ cd node-isw-macro/src<br>
$ node main.js<br>

3. 실행 시 개인 계정 비밀번호 입력

<br><br><br>

# 일괄실행 with jest
0. npm 설치 (최초 1회만)<br>
    ```
    $ cd node-isw-macro/<br>
    $ npm i<br>
    $ npm i -g jest<br>
    ```

1. 데이터 작업 (dat 디렉토리)<br>
  * ISW Solution Designer에서 `domain namespace` 및 `root entity`는 미리 생성해야함
  * 파일명 작성방법<br>
    `{RootEntity명}_{ProjectAcronym}_{도메인네임스페이스명}_Properties.dat`<br>

  * 파일 레이아웃<br>
  `localIdentifier type label shortLabel notes decimalPlaces selectionElements`<br>
    - 예시 1<br>
      - `groupCoCd,CHAR(3),그룹회사코드,그룹회사코드,그룹회사코드,0, `
      - `limtFeeDscntrt,DECIMAL(9|5),한도수수료할인율,한도수수료할인율,한도수수료할인율,0, `
    - 예시 2<br>
      - `groupCoCd,text,그룹회사코드,그룹회사코드,그룹회사코드,0, `
      - `limtFeeDscntrt,decimal,한도수수료할인율,한도수수료할인율,한도수수료할인율,5, `

    *FYI*<br>
      - 예시1, 예시2 두 타입 다 가능함
      - type 필드는 KBmeta를 그대로 복사한 경우 반드시 , 를 | 로 변경 (DECIMAL(9,5) -> DECIMAL(9|5)) 해야하며, decimalPlace는 프로그램 내부에서 set 해주므로 decimalPlaces 필드에는 아무값이나 넣어도 됨 (type을 text, char로 변경 시에는 decimalPlace를 반드시 넣어줘야함)
      - 

2. isw id/pw 및 작업파일명 입력
   ```
   $ cd node-isw-macro/src/__tests__
   domainSub.spec.js 파일 내 id, pw 값 및 파일명 수정
      beforeAll(async () => {
        const id = '직원번호';
        const pw = '비밀번호';
        global.token = await getIswToken(id, pw);
      });
    const filename = 'THKHC0401_BATCHTEST_batch_Properties.dat';
   ```
   
3. 매크로실행<br>
    ```
    $ cd node-isw-macro/src<br>
    $ jest __tests__/domainSub.spec.js<br>
    ```
