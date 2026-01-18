import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Help Center</h1>

      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How do I join a live session?</AccordionTrigger>
                        <AccordionContent>
                            Go to your Dashboard or "My Halaqas" page. When a session is live, you will see a "Join Session" button. Click it to enter the virtual classroom.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Can I change my teacher?</AccordionTrigger>
                        <AccordionContent>
                            Yes, you can browse other available halaqas in the "Browse New Halaqas" section. If you are in a private track, please contact support.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is Itqan really free?</AccordionTrigger>
                        <AccordionContent>
                            Yes, Itqan is a Waqf/Sadaqah Jariyah project and is completely free for students.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
                <p className="mb-6 text-muted-foreground">Still need help? Our team is here for you.</p>
                <Button size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
