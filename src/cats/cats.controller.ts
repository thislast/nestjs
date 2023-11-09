import { Body, Controller, Get, Header, Param, Post, Query, Redirect, Req } from '@nestjs/common';
import { CreateCatDto } from './create-cat.dto';

@Controller('cats')
export class CatsController {
    /**
     * To specify a custom response header, you can either use a @Header() decorator or a library-specific response object 
     */
    @Post()
    @Header('Cache-Control', 'none')
    async create(@Body() createCatDto: CreateCatDto) {
        console.log(createCatDto);
        return 'This action adds a new cat';
    }

    /**
     * As mentioned, the response status code is always 200 by default, except for POST requests which are 201. We can easily change this behavior by adding the @HttpCode(...) decorator at a handler level. 
     */
    @Get()
    // @HttpCode(222)
    findAll(@Req() request: Request): string {
        console.log(request);
        return 'This action returns all cats';
    }

    /**
     * we can add route parameter tokens in the path of the route to capture the dynamic value at that position in the request URL.
     */
    @Get(':id')
    // findOne(@Param('id') id: string): string {
    findOne(@Param() params: any): string {
        console.log(params);
        return `This action returns a #${params.id} cat`;
    }

    /**
     * The 'ab*cd' route path will match abcd, ab_cd, abecd, and so on. The characters ?, +, *, and () may be used in a route path, and are subsets of their regular expression counterparts. The hyphen ( -) and the dot (.) are interpreted literally by string-based paths.
     */
    @Get('ab*cd')
    findAll1(): string {
        return 'This route uses a wildcard';
    }

    /**
     * To redirect a response to a specific URL, you can either use a @Redirect() decorator or a library-specific response object.
     * @Redirect() takes two arguments, url and statusCode, both are optional. The default value of statusCode is 302 (Found) if omitted
     */
    @Get('docs')
    @Redirect('https://docs.nestjs.com', 302)
    getDocs(@Query('version') version) {
        version = '5'
        if (version && version === '5') {
            return {url: 'https://docs.nestjs.com/v5/'};
        }
    }
}
