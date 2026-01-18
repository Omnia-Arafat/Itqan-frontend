import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms & Privacy</h1>
      
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
                <p>Welcome to Itqan. By using our platform, you agree to the following terms:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Respect the sanctity of the Quran and Islamic teachings.</li>
                    <li>Maintain professional conduct during live sessions.</li>
                    <li>Do not share account credentials with others.</li>
                    <li>We reserve the right to suspend accounts violating these terms.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
                <p>Your privacy is important to us. Here is how we handle your data:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>We collect only necessary information for your learning progress.</li>
                    <li>Video sessions are processed via Jitsi and are not recorded by us unless explicitly stated.</li>
                    <li>We do not sell your data to third parties.</li>
                    <li>You can request data deletion at any time.</li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
