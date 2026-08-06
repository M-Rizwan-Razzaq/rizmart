import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ContactService } from "./contact.service";

@ApiTags("Contact")
@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: "Send a contact form message" })
  @ApiResponse({ status: 201, description: "Message queued for admin email" })
  sendMessage(@Body() dto: CreateContactDto) {
    return this.contactService.sendContactMessage(dto);
  }
}
