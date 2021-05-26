import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  constructor() {
    //
  }

  @Get("/")
  wordCount(){
    return "Hello World";
  }
}
