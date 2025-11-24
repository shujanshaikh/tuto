import { Button } from "@/components/ui/button"
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTRPC } from "@/utils/trpc"
import { useMutation } from "@tanstack/react-query"

export const Route = createFileRoute("/meetings")({
  component: RoomsPage,
});

function RoomsPage() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState("")
  const [username, setUsername] = useState("")
  const trpc = useTRPC()

  const generateUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };


  const createMeetingMutation = useMutation(trpc.meeting.createMeeting.mutationOptions());

  const handleCreateMeeting = async () => {
    try {
      const meetingId = generateUUID();
      await createMeetingMutation.mutateAsync({
        id: meetingId,
        name: topic,
        description: `Meeting created by ${username}`,
      });
      toast.success("Meeting created successfully");
      navigate({ to: "/meeting/$uuid", params: { uuid: meetingId } });

    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create meeting");
      return null;
    }
  }


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2">New Class</h1>
            <p className="text-muted-foreground">Start a live session with your students</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium">
                  Class Topic
                </label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., Mathematics - Chapter 5"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Display name for students"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11"
                />
              </div>

              <Button
                onClick={handleCreateMeeting}
                disabled={createMeetingMutation.isPending || !topic.trim() || !username.trim()}
                className="w-full h-11 mt-2"
              >
                {createMeetingMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Start Session
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Students will be able to join using your class link
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}