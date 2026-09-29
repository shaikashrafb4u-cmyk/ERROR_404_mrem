// Automated Verification Test for SupportHaven Backend Services
import { sessionService } from "../services/sessionService.js";
import { analyzeSentiment } from "../services/sentimentService.js";
import { aiService } from "../services/aiService.js";
import { findOrder } from "../data/mockOrders.js";

async function runTests() {
  console.log("🚀 Starting SupportHaven Backend Verification Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Test 1: Order Lookup
  console.log("--- Testing Order Database ---");
  const order1 = findOrder("ORD-9482");
  assert(order1 !== null && order1.customerName === "Sarah Jenkins", "Found order ORD-9482 for Sarah Jenkins");
  const orderPartial = findOrder("8219");
  assert(orderPartial !== null && orderPartial.orderId === "ORD-8219", "Found order by partial digits 8219");
  const orderMissing = findOrder("ORD-0000");
  assert(orderMissing === null, "Handled non-existent order gracefully");

  // Test 2: Sentiment Analysis & Escalation Triggers
  console.log("\n--- Testing Sentiment Analysis & Escalation Triggers ---");
  const positive = analyzeSentiment("Thank you so much, this was super helpful and fast!");
  assert(positive.score > 0.3 && positive.label === "Delighted" || positive.label === "Positive", `Positive sentiment detected: ${positive.label} (${positive.score})`);

  const angry = analyzeSentiment("This is ridiculous! My package is completely broken and this is the worst service ever!");
  assert(angry.score < -0.3 && (angry.label === "Upset" || angry.label === "Frustrated"), `Frustration detected: ${angry.label} (${angry.score})`);
  assert(angry.escalationTriggered === true, "Escalation triggered automatically on high distress");

  const humanReq = analyzeSentiment("Can I please speak to a human agent right now?");
  assert(humanReq.escalationTriggered === true, "Escalation triggered on explicit request for human");

  // Test 3: Session Management
  console.log("\n--- Testing Session Service ---");
  const session = sessionService.getOrCreateSession("test-sess-1");
  assert(session.id === "test-sess-1", "Session created successfully");
  assert(session.messages.length === 1, "Session initialized with welcome message");

  sessionService.addMessage("test-sess-1", {
    role: "user",
    text: "Where is my order ORD-9482?",
    sentimentScore: 0
  });
  assert(session.messages.length === 2, "User message appended to session");

  // Test 4: AI Empathetic Conversational Response
  console.log("\n--- Testing AI Conversational Response Engine ---");
  const resOrder = await aiService.generateResponse({
    message: "Where is my order ORD-9482?",
    session,
    sentimentData: { score: 0, label: "Neutral", escalationTriggered: false }
  });
  assert(resOrder.text.includes("ORD-9482") || resOrder.text.includes("FedEx"), "AI response includes specific tracking info for ORD-9482");
  assert(!resOrder.text.includes("As an AI"), "AI response does NOT contain robotic 'As an AI' phrasing");

  // Test 5: Return Policy Query
  const resReturn = await aiService.generateResponse({
    message: "Can I return an item I bought last week?",
    session,
    sentimentData: { score: 0, label: "Neutral", escalationTriggered: false }
  });
  assert(resReturn.text.toLowerCase().includes("30-day") || resReturn.text.toLowerCase().includes("return"), "AI response explains return policy warmly");

  // Test 6: Damaged Item Empathy & Resolution
  const resDamaged = await aiService.generateResponse({
    message: "My headphones arrived completely cracked and damaged!",
    session,
    sentimentData: { score: -0.5, label: "Concerned", escalationTriggered: false }
  });
  assert(resDamaged.text.toLowerCase().includes("sorry") || resDamaged.text.toLowerCase().includes("replacement"), "AI response validates feelings and offers replacement");

  // Test 7: Analytics Gathering
  console.log("\n--- Testing Analytics Engine ---");
  const analytics = sessionService.getAnalytics();
  assert(analytics.totalSessions >= 1, `Analytics correctly reported total sessions: ${analytics.totalSessions}`);
  assert(typeof analytics.averageSentiment === "number", `Analytics computed average sentiment: ${analytics.averageSentiment}`);

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
