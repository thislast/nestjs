Providers

Providers는 Nest의 기초개념이다. 많은 기본 Nest 클래스들은 Provider (services, repositories, factories, helpers and so on) 로 다뤄져야한다. Provider의 주된 아이디어는 의존성을 주입할 수 있다는 것에서 나왔다. 객체가 다양한 관계를 만들수 있다는 의미이고 객체의 배선기능은 Nest 런타임 시스템에 할당될 수 있다.

![test](../../img/Components_1.png)
출처(https://docs.nestjs.com/providers)

이전 쳅터에서, 우리는 간단하게 CatsController를 빌드했다. Controller는 HTTP requests를 핸들링할수있고, 더 많은 복잡한 일들을 providers에게 할당해야한다.
Providers는 module에서 providers라고 선언된 평문 자바스크립트이다.


Services

간단한 CatsService만드는 것을 시작해보자. 이 서비스는 데이타 저장과 검색에 책임이 있을 것이고 CatsController에의해 사용되도록 디자인되었다.
그래서 providers를 정의하기에 좋은 후보자이다.


```
-cats.service.ts

import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```
# To create a service using the CLI
$nest g service cats

위의 CatsService는 하나의 property와 두개의 method를 가지고있는 기본 class이다.
유일한 새로운 특징은 @Injectable() decorator를 쓰고있다는 것이다.
Injectable() decorator는 Catservice가 IoC container로 관리 되도록 선언되어진 , metadata에 접근할 수 있다. 어쩃든, 이 예제는 Cat 밑에 있는 interface를 사용한다.

```
-interfaces/cat.interface.ts

export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```


