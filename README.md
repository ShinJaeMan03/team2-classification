# 멀티탭위험도판정기

자취방 멀티탭에 연결한 기기를 고르면 과부하와 화재위험도를 판정하고, 어떤 기기를 벽 콘센트로 옮기면 좋은지 알려 주는 프로그램입니다.

## 실행 방법

설치할 것은 없습니다. 크롬이나 엣지에서 열면 됩니다.

1. [멀티탭위험도판정기.html](멀티탭위험도판정기.html)을 누릅니다.
2. 오른쪽 위의 **Download raw file**(아래 화살표) 버튼을 누릅니다.
3. 내려받은 파일을 더블클릭합니다.

## 파일

| 파일 | 내용 |
|---|---|
| [멀티탭위험도판정기.html](멀티탭위험도판정기.html) | 프로그램. 기능 1(화재위험도), 기능 2(전기요금, 준비 중), 판정 기준·자료 탭 |
| [powerstrip_realistic.csv](powerstrip_realistic.csv) | 점검에 쓴 현실형 가상 데이터 1,000행 |
| [make_realistic_data.js](make_realistic_data.js) | 위 데이터를 만드는 코드. 다시 만들려면 `node make_realistic_data.js` (프로그램 실행에는 필요 없음) |

## 판정 방식

점수(100점)로 등급을 정하고, 정해진 조건에서는 점수와 상관없이 최소 등급을 보장합니다.

| 요인 | 배점 |
|---|---|
| 부하율 | 50 |
| 사용 기간 | 18 |
| 동시에 켜는 500W 이상 발열 기기 | 15 |
| 장시간 사용 | 9 |
| 구수 초과 | 8 |

- **등급:** 안전 0\~24, 주의 25\~49, 위험 50\~69, 매우 위험 70 이상
- **최소 매우 위험:** 부하율 125% 이상
- **최소 위험:** 부하율 100% 초과, 손상, 이상 발열, 연속 연결
- **최소 주의:** 부하율 80% 이상, 모두 켜면 정격 초과, 구수 초과, 5년 이상, 먼지
- **최대 동시 사용 전력:** 동시 사용 기기의 합 + 번갈아 쓰는 기기 중 가장 큰 1개

## 점검 결과

현실형 가상 데이터 1,000행의 정답 등급(안전·주의·위험·매우 위험)과 비교했습니다. 정답은 프로그램 점수를 쓰지 않고, 28일 모의 사용의 최고 온도 상승에 손상·이상 발열·연속 연결·먼지·5년 기준을 더해 정했습니다.

| 항목 | 결과 |
|---|---|
| 정답과 일치 | 75.2% |
| 안전·주의인데 위험 이상으로 판정 | 19행 |
| 위험 이상인데 주의로 판정 | 21행 |
| 위험 이상인데 안전으로 판정 | 0행 |

조리기기를 실제로 함께 켜는데 "동시 사용"을 체크하지 않으면 낮게 판정될 수 있습니다.

## 사용한 자료

### 수업·첨부 자료 (원본은 저장소에 없음)

| 자료 | 사용한 곳 |
|---|---|
| `powerstrip_training.csv` (3,000행, 합성 데이터) | 부하율 80%·100%, 5년, 먼지, 손상, 이상 발열, 연속 연결 기준 |
| 한국전기안전공사 「연도별 전기화재 발화원인별 현황」 (2025-12-31 기준) | 2025년 전기화재 원인 그래프 (9,376건) |

### 안전 기준과 화재 원인

| 자료 | 사용한 내용 |
|---|---|
| [산업통상부·국립소방연구원·한국소비자원 소비자 안전주의보](https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/170883/view) (2025) | 정격용량 초과 금지, 연속 연결 금지, 고전력 기기 벽면 단독 콘센트 |
| [한국화재보험협회 「멀티탭의 화재위험성 및 대책」](https://www.kfpa.or.kr/webzine/202510/disaster8.html) (2025) | 2024년 스위치 멀티탭 화재 337건의 원인(소방청 통계), 보통 정격 16A, 교체 권장 1\~2년, 20A 차단기, 4구 이상 과부하 보호장치 |
| [전기안전연구원 「개별스위치 멀티탭 사용에 의한 전기화재 위험성 연구」](https://www.koreascience.or.kr/article/CFKO201531751956880.pdf) (2015) | 20A·30A 온도 변화, 125% 기준, 가상 데이터의 온도 계산 |
| [KC 60884-1](https://www.law.go.kr/LSW/flDownload.do?flSeq=169459195) | 단자 온도 상승 45K 이하 |
| [한국전기안전공사 발표 보도, MTN](https://news.mtn.co.kr/article/2026111215323455408) (2026) | 난방기기 벽면 단독 연결, 여러 난방제품 동시 사용 금지 |
| [노원소방서 안내 보도](https://www.sisanews.org/articles/224311530757) | 정격용량의 80% 이내 사용 |
| [다음 뉴스](https://v.daum.net/v/G2ipgt9UcO) | 1,000W 이상 기기는 멀티탭 사용 피하기 |

### 기기 소비전력 (35개)

공단 11개와 공단 환산 4개는 [한국에너지공단 효율관리제도](https://eep.energy.or.kr/certification/certi_intro.aspx) 값입니다. 추정값 16개는 다나와 검색 첫 페이지 제품 표기의 중앙값, 추정값(제품 1개) 4개는 제품 하나의 표기입니다.

<details>
<summary>기기별 값과 출처 전체 보기</summary>

| 기기 | 소비전력 | 발열 | 구분 | 출처 |
|---|---|---|---|---|
| 전기온풍기 | 2,000W | 발열 | 공단 | [공단 신고 523개 정격 중앙값(2022년 이후, 3,520W 이하)](https://eep.energy.or.kr/certification/certi_list_293.aspx) |
| 전기스토브 | 1,200W | 발열 | 공단 | [공단 신고 1,209개 정격 중앙값(2022년 이후, 3,520W 이하)](https://eep.energy.or.kr/certification/certi_list_134.aspx) |
| 전기요(싱글) | 120W | 발열 | 추정값(제품 1개) | [일월 IW-KM59 싱글 표기 약 120W](https://www.kurly.com/goods/1001730521) |
| 가열식 가습기 | 600W | 발열 | 추정값 | [다나와 표기 38개 중앙값(중간 50% 390~680W)](https://search.danawa.com/dsearch.php?query=%EA%B0%80%EC%97%B4%EC%8B%9D%20%EA%B0%80%EC%8A%B5%EA%B8%B0) |
| 초음파 가습기 | 23W | - | 추정값 | [다나와 표기 33개 중앙값(중간 50% 3~25W)](https://search.danawa.com/dsearch.php?query=%EC%B4%88%EC%9D%8C%ED%8C%8C%20%EA%B0%80%EC%8A%B5%EA%B8%B0) |
| 선풍기 | 50W | - | 추정값(제품 1개) | [SSG 14인치 제품 1개(검색 결과로만 확인)](https://www.ssg.com/item/itemView.ssg?itemId=1000027898219) |
| 이동식 에어컨 | 1,823W | - | 공단 | [공단 신고 619개 냉방 소비전력 측정 중앙값](https://eep.energy.or.kr/certification/certi_list_290.aspx) |
| 제습기(12L 이하) | 162W | - | 공단 | [공단 신고 220개 1시간 소비전력량 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_145.aspx) |
| 전기포트 | 1,350W | 발열 | 추정값 | [다나와 표기 39개 중앙값(중간 50% 900~1,850W)](https://search.danawa.com/dsearch.php?query=%EB%AC%B4%EC%84%A0%EC%A3%BC%EC%A0%84%EC%9E%90) |
| 전자레인지 | 1,350W | 발열 | 추정값 | [다나와 소비전력 표기 40개 중앙값(중간 50% 1,100~1,570W)](https://search.danawa.com/dsearch.php?query=%EC%A0%84%EC%9E%90%EB%A0%88%EC%9D%B8%EC%A7%80) |
| 에어프라이어 | 1,500W | 발열 | 추정값 | [다나와 표기 39개 중앙값(중간 50% 1,400~1,750W)](https://search.danawa.com/dsearch.php?query=%EC%97%90%EC%96%B4%ED%94%84%EB%9D%BC%EC%9D%B4%EC%96%B4) |
| 전기밥솥(6인용 이하) | 880W | 발열 | 공단 | [공단 신고 726개 정격 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_295.aspx) |
| 전기밥솥(10인용 이상) | 1,455W | 발열 | 공단 | [공단 신고 337개 정격 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_295.aspx) |
| 인덕션(1구) | 2,000W | 발열 | 추정값 | [다나와 표기 39개 중앙값(중간 50% 2,000~2,000W)](https://search.danawa.com/dsearch.php?query=1%EA%B5%AC%20%EC%9D%B8%EB%8D%95%EC%85%98) |
| 라면포트·멀티쿠커 | 820W | 발열 | 추정값 | [다나와 표기 24개 중앙값(중간 50% 730~1,000W)](https://search.danawa.com/dsearch.php?query=%EB%A9%80%ED%8B%B0%EC%BF%A0%EC%BB%A4%20%EB%9D%BC%EB%A9%B4%ED%8F%AC%ED%8A%B8) |
| 전기그릴 | 1,500W | 발열 | 추정값 | [다나와 표기 35개 중앙값(중간 50% 1,200~1,700W)](https://search.danawa.com/dsearch.php?query=%EC%A0%84%EA%B8%B0%EA%B7%B8%EB%A6%B4) |
| 토스터 | 900W | 발열 | 추정값 | [다나와 표기 37개 중앙값(중간 50% 800~1,300W)](https://search.danawa.com/dsearch.php?query=%ED%86%A0%EC%8A%A4%ED%84%B0%EA%B8%B0) |
| 캡슐커피머신 | 1,260W | 발열 | 추정값 | [다나와 표기 35개 중앙값(중간 50% 1,150~1,340W)](https://search.danawa.com/dsearch.php?query=%EC%BA%A1%EC%8A%90%EC%BB%A4%ED%94%BC%EB%A8%B8%EC%8B%A0) |
| 소형 냉장고 | 69W | - | 추정값(제품 1개) | [다나와 제품 1개 표기](https://search.danawa.com/dsearch.php?query=%EC%86%8C%ED%98%95%EB%83%89%EC%9E%A5%EA%B3%A0) |
| 제빙기 | 200W | - | 추정값 | [다나와 표기 30개 중앙값(중간 50% 150~500W)](https://search.danawa.com/dsearch.php?query=%EC%A0%9C%EB%B9%99%EA%B8%B0) |
| 헤어드라이어 | 1,600W | 발열 | 추정값 | [다나와 표기 38개 중앙값(중간 50% 1,600~1,700W)](https://search.danawa.com/dsearch.php?query=%ED%97%A4%EC%96%B4%EB%93%9C%EB%9D%BC%EC%9D%B4%EC%96%B4) |
| 고데기 | 43W | 발열 | 추정값 | [다나와 표기 27개 중앙값(중간 50% 35~70W)](https://search.danawa.com/dsearch.php?query=%EA%B3%A0%EB%8D%B0%EA%B8%B0) |
| 스팀다리미 | 1,800W | 발열 | 추정값 | [다나와 표기 37개 중앙값(중간 50% 1,500~2,100W)](https://search.danawa.com/dsearch.php?query=%EC%8A%A4%ED%8C%80%EB%8B%A4%EB%A6%AC%EB%AF%B8) |
| 통돌이 세탁기(10kg) | 300W | - | 추정값(제품 1개) | [LG TR10WL 1개(원문 표 대조는 못 함)](https://www.lge.co.kr/washing-machines/tr10wl-dkor) |
| 노트북 충전기(65W) | 73W | - | 공단 환산 | [공단 어댑터 출력 65W ÷ 효율 중앙값 88.6%(574개)](https://eep.energy.or.kr/certification/certi_list_125.aspx) |
| 휴대폰 충전기(15W) | 18W | - | 공단 환산 | [공단 어댑터 최다 출력 15W ÷ 효율 중앙값 81.3%(1,859개)](https://eep.energy.or.kr/certification/certi_list_125.aspx) |
| 모니터(24형) | 15W | - | 공단 | [공단 신고 2,633개 켜진 상태 측정 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_278.aspx) |
| 모니터(27형) | 21W | - | 공단 | [공단 신고 4,533개 켜진 상태 측정 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_278.aspx) |
| TV(43형급) | 46W | - | 공단 환산 | [공단 √㎡당 소비전력 × √화면면적, 3,262개 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_143.aspx) |
| 빔프로젝터 | 252W | - | 추정값 | [다나와 표기 34개 중앙값(중간 50% 137~335W)](https://search.danawa.com/dsearch.php?query=%EB%B9%94%ED%94%84%EB%A1%9C%EC%A0%9D%ED%84%B0) |
| 레이저 복합기 | 770W | 발열 | 공단 | [공단 신고 344개 정격 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_286.aspx) |
| 유선 청소기 | 1,254W | - | 공단 | [공단 신고 299개 측정 소비전력 중앙값(전체 연도)](https://eep.energy.or.kr/certification/certi_list_115.aspx) |
| 공기청정기 | 36W | - | 공단 환산 | [공단 ㎡당 소비전력 × 표준사용면적, 80개 표본 중앙값](https://eep.energy.or.kr/certification/certi_list_121.aspx) |
| LED 스탠드 | 12W | - | 추정값 | [다나와 표기 30개 중앙값(중간 50% 6~20W)](https://search.danawa.com/dsearch.php?query=LED%20%EC%8A%A4%ED%83%A0%EB%93%9C) |
| LED 전구 | 14W | - | 공단 | [공단 신고 3,318개 정격 중앙값(2022년 이후)](https://eep.energy.or.kr/certification/certi_list_246.aspx) |

</details>

## 한계

- **가상 데이터:** 두 데이터 모두 실제 화재 기록이 아니므로, 일치율은 화재 예측 정확도가 아닙니다. 현실형 데이터의 기기 보유 비율과 사용 시간은 팀이 정한 가정입니다.
- **팀이 정한 값:** 배점, 등급 구간, 장시간 기준(6·12시간), 500W 기준, 발열 기기 구분, 번갈아 쓰는 기기 구분.
- **교체 1\~2년:** 법정 기한이 아니며, 화재보험협회가 한국전기안전공사·한국환경공단 권장으로 인용한 내용입니다.
- **125% 기준:** 과부하 차단 기능이 없는 3구 멀티탭 한 종류의 실험을 참고했습니다.
- **전체 전기화재 통계:** 멀티탭만이 아닌 모든 전기화재를 집계한 값입니다.
- **선풍기·세탁기:** 선풍기는 검색 결과로만 확인했고, 세탁기는 원문 사양표와 대조하지 못했습니다.

수업용 프로그램이며 실제 안전 진단을 대신하지 않습니다. 소비전력은 실제 제품 라벨을 확인해 주세요.
