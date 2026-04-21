import re

# Read all the source parts
with open('/home/user/workspace/bizquest/js/questions.partial.714dc2.js', 'r') as f:
    partial1 = f.read()

with open('/home/user/workspace/bizquest/js/questions_continuation.partial.975324.js', 'r') as f:
    partial2 = f.read()

with open('/home/user/workspace/bizquest/js/questions_cont2.js', 'r') as f:
    cont2 = f.read()

with open('/home/user/workspace/bizquest/js/health_section.js', 'r') as f:
    health = f.read()

with open('/home/user/workspace/bizquest/js/consulting_section.js', 'r') as f:
    consulting = f.read()

print("partial1 lines:", len(partial1.splitlines()))
print("partial2 lines:", len(partial2.splitlines()))
print("cont2 lines:", len(cont2.splitlines()))
print("health lines:", len(health.splitlines()))
print("consulting lines:", len(consulting.splitlines()))
