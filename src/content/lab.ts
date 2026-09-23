/**
 * ──────────────────────────────────────────────────────────────────────────
 *  ABHI — THE LAB (behind the Garage)
 *
 *  The physical side: one prototype and the experiments around it. Each
 *  entry gets its own page at /lab/[slug] with its own visual.
 *
 *  Rule of the bench: explanations of how a part works are general
 *  engineering; `known` is only what Abhi has confirmed about his own
 *  build. Anything else stays an [ADD …] marker until he fills it in.
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { GlyphName } from "./site";

export type LabVisual = "lean" | "tilt" | "compass" | "sonar" | "tof" | "ir" | "radio" | "pio" | "blink" | "alarm";

export type LabChapter = { label: string; title: string; body: string; bug?: boolean };

export type LabEntry = {
  slug: string;
  number: string;
  title: string;
  titleLines: string[];
  status: "Prototype" | "Experiment";
  kind: string;
  /** One line for the index. */
  line: string;
  parts: string[];
  glyph: GlyphName;
  visual: LabVisual;
  /** The page's own storyline, e.g. sensor → angle → visualization. */
  arc: string[];
  chapters: LabChapter[];
  /** Confirmed facts about Abhi's own build. */
  known: string[];
  /** What's still missing, shown as an [ADD …] marker. */
  todo: string;
  media: { image: string; caption: string }[];
  related?: string[];
  /** The build story the lean gauge walks through (prototype only). */
  story?: { label: string; note: string; bug?: boolean }[];
  disclaimer?: string;
};

export const lab = {
  title: "The lab",
  lead: "Behind the Garage: one prototype and the experiments that got it there. Each one filed, each one with its own page.",
  note: "Explanations are how the parts work. What I did with each one is on the page — and where I haven't written it up yet, it says so.",
};

export const labEntries: LabEntry[] = [
  {
    slug: "motorcycle-safety",
    number: "01",
    title: "Motorcycle safety",
    titleLines: ["Motorcycle", "safety"],
    status: "Prototype",
    kind: "Embedded prototype",
    line: "Could a bike know when it's leaning too far?",
    parts: ["MPU6050", "Microcontroller", "LEDs", "Buzzer"],
    glyph: "imu",
    visual: "lean",
    arc: ["Problem", "Physical system", "Sensors", "Decision", "Prototype"],
    chapters: [
      { label: "Problem", title: "What was the problem?", body: "A motorcycle doesn't tell you how far it's leaning — you find out from the road. Could a small board on the bike notice when a lean is getting extreme, and say so while there's still time to react?" },
      { label: "Built", title: "What did I build?", body: "A bench prototype: an MPU6050 motion sensor, one microcontroller, LEDs and a buzzer. It reads orientation, works out the lean angle, and warns when the angle gets extreme." },
      { label: "How", title: "How does it work?", body: "Raw readings → angle → threshold → warning. Four steps, and every one of them had a way to go wrong." },
      { label: "Sensors", title: "The sensor", body: "The MPU6050 is a 3-axis gyroscope and a 3-axis accelerometer on one chip, talking I²C. The accelerometer knows which way gravity points; the gyroscope knows how fast the board is turning." },
      { label: "Data", title: "The data", body: "Six numbers, many times a second: acceleration along X, Y and Z, and rotation around each axis. On their own they're noise. The lean angle is what you work out from them." },
      { label: "Logic", title: "The decision", body: "Compare the angle with a threshold. Past it, the LEDs light and the buzzer sounds. Below it, the board stays quiet — a warning that cries wolf gets ignored." },
      { label: "Testing", title: "Why is it reading −135°?", body: "The sensor had other plans. Check the axes. Check the maths. Check the axes again. Orientation bugs rarely look like bugs — they look like a perfectly confident, perfectly wrong number.", bug: true },
      { label: "Result", title: "Where it stands", body: "A working bench prototype. It worked. Eventually. It's an experimental safety concept — not a production safety system, and not something to trust on a real road." },
    ],
    known: ["MPU6050, a microcontroller, LEDs and a buzzer", "Lean angle worked out from orientation readings", "A threshold that triggers the LEDs and the buzzer", "The −135° bug — found, fixed"],
    todo: "ADD — photos, wiring, which microcontroller, the code, how you tested it",
    media: [
      { image: "images/lab/motorcycle-01", caption: "The prototype on the bench" },
      { image: "images/lab/motorcycle-02", caption: "Wiring" },
      { image: "images/lab/motorcycle-03", caption: "Serial output, mid-debug" },
    ],
    related: ["mpu6050-orientation", "warning-outputs"],
    disclaimer: "An experimental safety concept — not a production safety system.",
    story: [
      { label: "Idea", note: "Could a bike know when it's leaning too far?" },
      { label: "Wiring", note: "IMU, LEDs, buzzer, one microcontroller." },
      { label: "Code", note: "Raw readings → angle → threshold → warning." },
      { label: "Why is it reading −135°?", note: "The sensor had other plans.", bug: true },
      { label: "Debug", note: "Check the axes. Check the maths. Check the axes again." },
      { label: "Working prototype", note: "It worked. Eventually." },
    ],
  },
  {
    slug: "mpu6050-orientation",
    number: "02",
    title: "MPU6050 orientation",
    titleLines: ["MPU6050", "orientation"],
    status: "Experiment",
    kind: "Sensor experiment",
    line: "Six axes of motion, turned into an angle you can see.",
    parts: ["MPU6050", "I²C"],
    glyph: "imu",
    visual: "tilt",
    arc: ["Sensor", "Angle", "Visualization"],
    chapters: [
      { label: "Sensor", title: "Gravity is the reference", body: "An MPU6050 packs a 3-axis gyroscope and a 3-axis accelerometer onto one chip. Lying flat, the accelerometer reads about 1 g straight down — gravity is the one thing everything else is measured against." },
      { label: "Angle", title: "Tilt is trigonometry", body: "Tilt the board and gravity's share moves between the axes. Pitch and roll fall out of arctangents of those shares. Use the wrong axis — or the wrong quadrant — and you get confident nonsense like −135°." },
      { label: "Visualization", title: "Seeing what it sees", body: "Numbers scrolling past on a serial monitor don't tell you much. Plotted against time, or drawn as a board that tilts with the real one, they suddenly do." },
    ],
    known: ["On the bench, and the heart of the motorcycle safety prototype"],
    todo: "ADD — how you visualised it, a photo, the code",
    media: [{ image: "images/lab/mpu6050-01", caption: "The breakout board" }],
    related: ["motorcycle-safety", "mpu9250-heading"],
  },
  {
    slug: "mpu9250-heading",
    number: "03",
    title: "MPU9250 heading",
    titleLines: ["MPU9250", "heading"],
    status: "Experiment",
    kind: "Sensor experiment",
    line: "The MPU6050's big sibling: nine axes, and a compass.",
    parts: ["MPU9250", "AK8963 magnetometer"],
    glyph: "imu9",
    visual: "compass",
    arc: ["Nine axes", "North", "Heading"],
    chapters: [
      { label: "Nine axes", title: "Motion, plus a field", body: "A gyroscope, an accelerometer — and an AK8963 magnetometer on board. Three more axes, measuring the magnetic field instead of motion." },
      { label: "North", title: "North, give or take", body: "A magnetometer points at magnetic north, give or take everything metal nearby. Motors, steel and laptops bend the field, which is why compasses need calibrating before you believe them." },
      { label: "Heading", title: "A heading that holds", body: "Combine the magnetometer with the accelerometer's sense of down and you get a heading that stays put even when the board isn't lying flat." },
    ],
    known: ["On the bench next to the MPU6050"],
    todo: "ADD — what you built with it",
    media: [{ image: "images/lab/mpu9250-01", caption: "The MPU9250" }],
    related: ["mpu6050-orientation"],
  },
  {
    slug: "ultrasonic-ranging",
    number: "04",
    title: "Ultrasonic ranging",
    titleLines: ["Ultrasonic", "ranging"],
    status: "Experiment",
    kind: "Distance experiment",
    line: "Ping. Listen. Do the maths on the echo.",
    parts: ["HC-SR04"],
    glyph: "ultrasonic",
    visual: "sonar",
    arc: ["Ping", "Echo", "Distance"],
    chapters: [
      { label: "Ping", title: "A shout you can't hear", body: "Give the HC-SR04's trigger pin a short pulse and it fires a burst of 40 kHz sound — far above anything you can hear." },
      { label: "Echo", title: "The width of a pulse", body: "Its echo pin stays high for exactly as long as the sound takes to bounce back. That pulse width is the entire measurement." },
      { label: "Distance", title: "Divide by two", body: "Sound travels about 343 metres a second. Distance = echo time × 343 m/s ÷ 2 — halved because the sound went there and back. Good for roughly 2 to 400 cm." },
    ],
    known: ["Used for distance on the bench"],
    todo: "ADD — what you measured, and on which board",
    media: [{ image: "images/lab/hcsr04-01", caption: "The HC-SR04" }],
    related: ["tof-ranging"],
  },
  {
    slug: "tof-ranging",
    number: "05",
    title: "Laser time-of-flight",
    titleLines: ["Laser", "time-of-flight"],
    status: "Experiment",
    kind: "Distance experiment",
    line: "The same question as sonar, answered with light.",
    parts: ["VL53L0X"],
    glyph: "tof",
    visual: "tof",
    arc: ["Pulse", "Photons", "Distance"],
    chapters: [
      { label: "Pulse", title: "A laser you can't see", body: "The VL53L0X fires an invisible 940 nm pulse from a tiny laser — a VCSEL — built into the package." },
      { label: "Photons", title: "Nanoseconds, not milliseconds", body: "Light is almost a million times faster than sound: the round trip to something a metre away takes about 6.7 nanoseconds. The sensor counts the returning photons and does the timing on the chip." },
      { label: "Distance", title: "Different physics, different failures", body: "Ask it over I²C and it answers in millimetres, out to about 2 metres. Sound struggles with soft, angled surfaces; light struggles with very dark or shiny ones. Knowing which to use is the actual skill." },
    ],
    known: ["Used for distance on the bench, next to the HC-SR04"],
    todo: "ADD — what you used it for",
    media: [{ image: "images/lab/vl53l0x-01", caption: "The VL53L0X" }],
    related: ["ultrasonic-ranging"],
  },
  {
    slug: "ir-detection",
    number: "06",
    title: "IR detection",
    titleLines: ["IR", "detection"],
    status: "Experiment",
    kind: "Detection experiment",
    line: "Is something there? Is the line still under me?",
    parts: ["IR emitter", "IR receiver"],
    glyph: "ir",
    visual: "ir",
    arc: ["Emit", "Reflect", "Decide"],
    chapters: [
      { label: "Emit", title: "Shine", body: "An infrared LED lights up whatever is in front of it — invisible to you, bright to the receiver sitting next to it." },
      { label: "Reflect", title: "Measure what comes back", body: "Light surfaces bounce most of it back. Black tape swallows almost all of it. The receiver's reading tracks the difference." },
      { label: "Decide", title: "One bit of truth", body: "A comparator turns that reading into a single yes or no against a threshold you tune by hand — obstacle or no obstacle, line or no line." },
    ],
    known: ["Used for obstacle and line detection on the bench"],
    todo: "ADD — what it detected, and where",
    media: [{ image: "images/lab/ir-01", caption: "The IR module" }],
  },
  {
    slug: "esp32",
    number: "07",
    title: "ESP32",
    titleLines: ["ESP32"],
    status: "Experiment",
    kind: "Microcontroller",
    line: "The default brain for anything that needs to talk.",
    parts: ["ESP32", "Wi-Fi", "Bluetooth"],
    glyph: "esp32",
    visual: "radio",
    arc: ["Device", "Data", "Communication"],
    chapters: [
      { label: "Device", title: "Two cores and two radios", body: "A dual-core Xtensa LX6 at up to 240 MHz, with Wi-Fi and Bluetooth on the same chip. That combination is why it ends up in almost everything connected." },
      { label: "Data", title: "Readings in", body: "Sensors on I²C, SPI or the analog pins feed it readings, and it has the headroom to filter and package them on the spot." },
      { label: "Communication", title: "Messages out", body: "Then it sends them somewhere — over Wi-Fi to a server, or Bluetooth to a phone. That last step is exactly what a plain Arduino can't do on its own." },
    ],
    known: ["One of the three microcontroller families on the bench"],
    todo: "ADD — what you connected it to",
    media: [{ image: "images/lab/esp32-01", caption: "The ESP32" }],
    related: ["pico", "arduino"],
  },
  {
    slug: "pico",
    number: "08",
    title: "Raspberry Pi Pico",
    titleLines: ["Raspberry Pi", "Pico"],
    status: "Experiment",
    kind: "Microcontroller",
    line: "Cheap, fast, and very good at precise timing.",
    parts: ["Raspberry Pi Pico", "RP2040"],
    glyph: "pico",
    visual: "pio",
    arc: ["System", "Processing", "Output"],
    chapters: [
      { label: "System", title: "An RP2040", body: "Two Arm Cortex-M0+ cores at up to 133 MHz and 264 KB of SRAM, on a board that costs less than lunch." },
      { label: "Processing", title: "Little machines beside the cores", body: "Next to the cores sit programmable I/O blocks — tiny state machines running their own instructions, so a timing-critical signal never waits for the CPU to catch up." },
      { label: "Output", title: "Exact pulses", body: "Which means exact output: LED strips, protocols the chip doesn't speak natively, signals that have to land on the microsecond." },
    ],
    known: ["One of the three microcontroller families on the bench"],
    todo: "ADD — what you ran on it",
    media: [{ image: "images/lab/pico-01", caption: "The Pico" }],
    related: ["esp32", "arduino"],
  },
  {
    slug: "arduino",
    number: "09",
    title: "Arduino",
    titleLines: ["Arduino"],
    status: "Experiment",
    kind: "Microcontroller",
    line: "The fastest route from idea to blinking LED.",
    parts: ["Arduino Uno", "ATmega328P"],
    glyph: "arduino",
    visual: "blink",
    arc: ["Blink", "Read", "React"],
    chapters: [
      { label: "Blink", title: "Hello, world", body: "An ATmega328P at 16 MHz with 5 V logic. The first program on any of them is the same one: make the LED on pin 13 blink." },
      { label: "Read", title: "See what it sees", body: "Then read something — a button, a sensor — and print it over serial, so you're looking at the same numbers the board is." },
      { label: "React", title: "Close the loop", body: "Then act on it: when the reading crosses a line, do something. Every prototype after that is a bigger version of this loop." },
    ],
    known: ["On the bench — the fastest route from idea to blinking LED"],
    todo: "ADD — your first Arduino builds",
    media: [{ image: "images/lab/arduino-01", caption: "The Uno" }],
    related: ["esp32", "pico"],
  },
  {
    slug: "warning-outputs",
    number: "10",
    title: "LEDs & buzzer",
    titleLines: ["LEDs &", "buzzer"],
    status: "Experiment",
    kind: "Output experiment",
    line: "The cheapest user interface there is — and the loudest.",
    parts: ["LEDs", "Resistors", "Piezo buzzer"],
    glyph: "buzzer",
    visual: "alarm",
    arc: ["Threshold", "Light", "Sound"],
    chapters: [
      { label: "Threshold", title: "The decision first", body: "An output is only as smart as the decision behind it: a number crosses a line, and now the board has to tell a human." },
      { label: "Light", title: "Always a resistor", body: "An LED needs a pin to switch it and a current-limiting resistor — always. Two of them are enough to say “look at me”." },
      { label: "Sound", title: "When light isn't loud enough", body: "A piezo buzzer is for when a light isn't enough — like on a moving motorcycle, where nobody is looking at a dashboard." },
    ],
    known: ["The warning side of the motorcycle safety prototype"],
    todo: "ADD — photos of the output side",
    media: [{ image: "images/lab/outputs-01", caption: "LEDs and buzzer" }],
    related: ["motorcycle-safety"],
  },
];

export function getLabEntry(slug: string) {
  return labEntries.find((e) => e.slug === slug);
}

export function getNextLabEntry(slug: string) {
  const i = labEntries.findIndex((e) => e.slug === slug);
  return labEntries[(i + 1) % labEntries.length];
}
