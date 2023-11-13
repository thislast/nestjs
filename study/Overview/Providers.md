# Providers

Providers는 Nest의 기초개념이다. 많은 기본 Nest 클래스들은 Provider (services, repositories, factories, helpers and so on) 로 다뤄져야한다. Provider의 주된 아이디어는 의존성을 주입할 수 있다는 것에서 나왔다. 객체가 다양한 관계를 만들수 있다는 의미이고 객체의 배선기능은 Nest 런타임 시스템에 할당될 수 있다.

![Component](../../img/Components_1.png)
출처(https://docs.nestjs.com/providers)

이전 쳅터에서, 우리는 간단하게 CatsController를 빌드했다. Controller는 HTTP requests를 핸들링할수있고, 더 많은 복잡한 일들을 providers에게 할당해야한다.
Providers는 module에서 providers라고 선언된 평문 자바스크립트이다.


Services
---
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
To create a service using the CLI
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
이제 우리는 cats를 검색하기위해 service클래스를 가졌다, CatsController안에서 사용해보자.

```
-cats.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```
CatsService는 constructor클래스를 통해 주입되었다. private 문법을 사용하는데 주목하라. 이것은 catsService멤버를 동일한 위치에서 초기화하고 선언할 수 있게 해준다.

Dependency injection
---
Nest는 Dependency injection으로 알려진 강력한 디자인 패턴으로 대부분 만들어졌다. 우리는 Angular docs에서 이 개념에대해 최고의 기사를 읽어볼걸 추천한다.

Nest에서는 TypeScript의 능력에 감사하고있다. 그것은 극도로 의존성을 관리하기 쉽다. 왜냐하면 그들은 타입으로 해결되기 때문이다. 밑에 예제에서 Nest는 만들어지고 CatsService의 instance를 return하는것으로부터 catsService를 해결할것이다. 이 dependency는 너의 controller's constructor를 통할것이고 해결되어질것이다.

```
constructor(private catsService: CatsService) {}
```

Scopes
---
Providers는 어플리케이션 생명주기와 동기화된 생명주기("scope")를 갖는다. 어플리케이션이 켜질때, 모든 의존성은 해결되어야하고 모든 provider는 instance화 된다.
비슷하게 어플리케이션이 꺼질 때, 각 provider는 파괴된다. 그러나 너의 provider 생명주기를 request-scoped로 만드는 방법도 있다. [Link](https://docs.nestjs.com/fundamentals/injection-scopes)

Custom providers
---
Nest는 providers사이에 관계를 해결하기 위해 내부적으로 IoC container 가지고있다. 이것은 위에서 설명한 dependency injection의 기초적인 특징이 된다. 하지만 실제로 얘기한 것보다 훨씬 강력한 기능이다. 여기에 provider를 정의하는 여러가지 방법이 있다. 너는 평문 값, 클래스 비동기 또는 동기화요소들을 사용할 수 있따. [Link](https://docs.nestjs.com/fundamentals/custom-providers)

Optional providers
---
가끔 너는 해결할 필요가 없는 의존성을 가지고있어야한다. 예를 들어 클래스는 구성 개체에 따라 달라질 수 있지만 전달된 항목이 없으면 기본값을 사용해야 한다. 이런 경우 의존성은 선택이 된다. 왜냐하면 provider가 없어도 error가 발생하지 않기때문이다.

provider가 constructor에 @Optional() decorator을 사용하는건 선택이다.

```
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

Property-based injection
---
providers가 constructor를 경유하여 주입된거 같은 기술은 constructor-based injection이라고 불린다. 몇몇 특별한 케이스에서 property-based injection은 유용하다. 예로 만일 너의 top-level class가 하나 혹은 여러개의 providers에 의존하고있다면, constructor로부터 sub-class에 super()를 부르는 방법은 매우 지루할 수 있다. 이것을 피하기 위하여, 너는 @Inject() decorator를 사용할 수 있다. 

```
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

